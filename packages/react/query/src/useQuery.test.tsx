import React, { Suspense, Component } from "react";
import { render, screen, act, waitFor } from "@testing-library/react";
import useQuery from "./useQuery";

// 테스트용 컴포넌트
function TestComponent({
  queryKey = "test",
  queryFn,
  initialData,
  isSuspense,
  isErrorBoundary,
  refetchOnWindowFocus,
  refetchOnReconnect,
}: any) {
  const { data, status, refetch } = useQuery({
    queryKey,
    queryFn,
    initialData,
    isSuspense,
    isErrorBoundary,
    refetchOnWindowFocus,
    refetchOnReconnect,
  });
  return (
    <div>
      <div data-testid="status">{status}</div>
      <div data-testid="data">{String(data)}</div>
      <button onClick={refetch}>refetch</button>
    </div>
  );
}

import * as QueryStore from "./QueryStore";
import * as QueryPromises from "./QueryPromises";

class ErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  override render() {
    if (this.state.hasError) return <div data-testid="error">error!</div>;
    return this.props.children;
  }
}

describe("useQuery", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(globalThis, "setInterval");
    jest.spyOn(globalThis, "clearInterval");
    jest.spyOn(window, "addEventListener");
    jest.spyOn(window, "removeEventListener");
    // 전역 캐시 초기화
    QueryStore.__clearAll();
    QueryPromises.__clearAll();
  });
  afterEach(() => {
    jest.clearAllTimers();
    jest.restoreAllMocks();
  });

  describe("기본 fetch 및 데이터 흐름", () => {
    it("기본 데이터 fetch 동작", async () => {
      const queryFn = jest.fn().mockResolvedValue("hello");
      render(<TestComponent queryFn={queryFn} />);
      expect(screen.getByTestId("status").textContent).toBe("pending");
      await waitFor(() =>
        expect(screen.getByTestId("status").textContent).toBe("success")
      );
      expect(screen.getByTestId("data").textContent).toBe("hello");
      expect(queryFn).toHaveBeenCalledTimes(1);
    });

    it("초기 데이터(initialData) 사용", async () => {
      let resolve: (v: string) => void;
      const queryFn = jest.fn().mockImplementation(
        () =>
          new Promise((res) => {
            resolve = res;
          })
      );
      render(<TestComponent queryFn={queryFn} initialData="init" />);
      // fetch가 느리게 동작하므로, 첫 렌더에서 initialData가 보임
      expect(screen.getByTestId("data").textContent).toBe("init");
      // fetch 완료 후 값이 바뀌는지 확인
      act(() => {
        resolve!("fetched");
      });
      await waitFor(() =>
        expect(screen.getByTestId("data").textContent).toBe("fetched")
      );
    });
  });

  describe("에러 및 Suspense 처리", () => {
    it("에러 처리", async () => {
      const queryFn = jest.fn().mockRejectedValue(new Error("fail"));
      render(<TestComponent queryFn={queryFn} />);
      await waitFor(() =>
        expect(screen.getByTestId("status").textContent).toBe("error")
      );
      expect(screen.getByTestId("data").textContent).toMatch(/Error/);
    });

    it("isErrorBoundary 옵션 시 에러 throw", async () => {
      const queryFn = jest.fn().mockRejectedValue(new Error("fail"));
      jest.spyOn(console, "error").mockImplementation(() => {});
      render(
        <ErrorBoundary>
          <TestComponent queryFn={queryFn} isErrorBoundary />
        </ErrorBoundary>
      );
      await waitFor(() =>
        expect(screen.getByTestId("error")).toBeInTheDocument()
      );
    });

    it("isSuspense 옵션 시 pending이면 promise throw", async () => {
      const queryFn = jest.fn().mockResolvedValue("data");
      render(
        <Suspense fallback={<div data-testid="suspense">loading</div>}>
          <TestComponent queryFn={queryFn} isSuspense />
        </Suspense>
      );
      expect(screen.getByTestId("suspense")).toBeInTheDocument();
      await waitFor(() =>
        expect(screen.getByTestId("data").textContent).toBe("data")
      );
    });
  });

  describe("refetch 및 자동 갱신", () => {
    it("refetch 함수로 데이터 갱신", async () => {
      let value = "first";
      const queryFn = jest
        .fn()
        .mockImplementation(() => Promise.resolve(value));
      render(<TestComponent queryFn={queryFn} />);
      await waitFor(() =>
        expect(screen.getByTestId("data").textContent).toBe("first")
      );
      value = "second";
      act(() => {
        screen.getByText("refetch").click();
      });
      await waitFor(() =>
        expect(screen.getByTestId("data").textContent).toBe("second")
      );
      expect(queryFn).toHaveBeenCalledTimes(2);
    });

    it("자동 refetch(interval) 동작", async () => {
      const queryFn = jest.fn().mockResolvedValue("interval");
      render(<TestComponent queryFn={queryFn} />);
      await waitFor(() =>
        expect(screen.getByTestId("status").textContent).toBe("success")
      );
      act(() => {
        jest.advanceTimersByTime(5 * 60 * 1000); // 5분
      });
      await waitFor(() => expect(queryFn).toHaveBeenCalledTimes(2));
    });

    it("윈도우 focus 시 refetch 동작", async () => {
      const queryFn = jest.fn().mockResolvedValue("focus");
      render(<TestComponent queryFn={queryFn} refetchOnWindowFocus />);
      await waitFor(() =>
        expect(screen.getByTestId("status").textContent).toBe("success")
      );
      act(() => {
        window.dispatchEvent(new Event("focus"));
      });
      await waitFor(() => expect(queryFn).toHaveBeenCalledTimes(2));
    });

    it("refetchOnWindowFocus=false면 focus refetch 안함", async () => {
      const queryFn = jest.fn().mockResolvedValue("focus");
      render(<TestComponent queryFn={queryFn} refetchOnWindowFocus={false} />);
      await waitFor(() =>
        expect(screen.getByTestId("status").textContent).toBe("success")
      );
      act(() => {
        window.dispatchEvent(new Event("focus"));
      });
      // 추가 호출 없음
      expect(queryFn).toHaveBeenCalledTimes(1);
    });

    it("온라인 복구 시 refetch 동작", async () => {
      const queryFn = jest.fn().mockResolvedValue("online");
      render(<TestComponent queryFn={queryFn} refetchOnReconnect />);
      await waitFor(() =>
        expect(screen.getByTestId("status").textContent).toBe("success")
      );
      act(() => {
        window.dispatchEvent(new Event("online"));
      });
      await waitFor(() => expect(queryFn).toHaveBeenCalledTimes(2));
    });

    it("refetchOnReconnect=false면 online refetch 안함", async () => {
      const queryFn = jest.fn().mockResolvedValue("online");
      render(<TestComponent queryFn={queryFn} refetchOnReconnect={false} />);
      await waitFor(() =>
        expect(screen.getByTestId("status").textContent).toBe("success")
      );
      act(() => {
        window.dispatchEvent(new Event("online"));
      });
      expect(queryFn).toHaveBeenCalledTimes(1);
    });
  });

  describe("캐싱 및 클린업", () => {
    it("fetch 중 중복 호출 방지 (promise 캐싱)", async () => {
      let resolve: (v: string) => void;
      const queryFn = jest
        .fn()
        .mockImplementation(() => new Promise((res) => (resolve = res)));
      render(<TestComponent queryFn={queryFn} />);
      // fetch 중 여러 번 refetch
      act(() => {
        screen.getByText("refetch").click();
        screen.getByText("refetch").click();
      });
      // 아직 resolve 안 됨
      expect(queryFn).toHaveBeenCalledTimes(1);
      act(() => {
        resolve!("done");
      });
      await waitFor(() =>
        expect(screen.getByTestId("data").textContent).toBe("done")
      );
    });

    it("unmount 시 interval, 이벤트 리스너 해제", async () => {
      const queryFn = jest.fn().mockResolvedValue("bye");
      const { unmount } = render(<TestComponent queryFn={queryFn} />);
      unmount();
      expect(clearInterval).toHaveBeenCalled();
      expect(window.removeEventListener).toHaveBeenCalled();
    });
  });
});
