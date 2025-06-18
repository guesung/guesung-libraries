import type React from "react";
import { Suspense, Component } from "react";
import { render, screen, act, waitFor } from "@testing-library/react";
import useQuery, { type UseQueryProps } from "./useQuery";

// 테스트용 컴포넌트
function TestComponent({
	queryKey = "test",
	queryFn,
	initialData,
	isSuspense,
	isErrorBoundary,
	refetchOnWindowFocus,
	refetchOnReconnect,
	// biome-ignore lint/suspicious/noExplicitAny: 테스트 컴포넌트
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
			<button type="button" onClick={refetch}>
				refetch
			</button>
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
		it("쿼리 함수가 정상적으로 데이터를 fetch하면 status가 success가 되고, data가 올바르게 표시된다.", async () => {
			const queryFn = jest.fn().mockResolvedValue("hello");
			render(<TestComponent queryFn={queryFn} />);
			expect(screen.getByTestId("status").textContent).toBe("pending");
			await waitFor(() =>
				expect(screen.getByTestId("status").textContent).toBe("success"),
			);
			expect(screen.getByTestId("data").textContent).toBe("hello");
			expect(queryFn).toHaveBeenCalledTimes(1);
		});

		it("initialData가 주어지면 fetch 완료 전까지 data에 초기값이 표시되고, fetch 완료 후에는 최신 데이터로 갱신된다.", async () => {
			let resolve: (v: string) => void;
			const queryFn = jest.fn().mockImplementation(
				() =>
					new Promise((res) => {
						resolve = res;
					}),
			);
			render(<TestComponent queryFn={queryFn} initialData="init" />);
			// fetch가 느리게 동작하므로, 첫 렌더에서 initialData가 보임
			expect(screen.getByTestId("data").textContent).toBe("init");
			// fetch 완료 후 값이 바뀌는지 확인
			act(() => {
				resolve("fetched");
			});
			await waitFor(() =>
				expect(screen.getByTestId("data").textContent).toBe("fetched"),
			);
		});
	});

	describe("에러 및 Suspense 처리", () => {
		it("쿼리 함수가 reject되면 status가 error로 표시된다.", async () => {
			const queryFn = jest.fn().mockRejectedValue(new Error("fail"));
			render(<TestComponent queryFn={queryFn} />);
			await waitFor(() =>
				expect(screen.getByTestId("status").textContent).toBe("error"),
			);
		});

		it("isErrorBoundary 옵션이 true일 때 쿼리 함수가 reject되면 ErrorBoundary가 에러를 표시한다.", async () => {
			const queryFn = jest.fn().mockRejectedValue(new Error("fail"));
			jest.spyOn(console, "error").mockImplementation(() => {});
			render(
				<ErrorBoundary>
					<TestComponent queryFn={queryFn} isErrorBoundary />
				</ErrorBoundary>,
			);
			await waitFor(() =>
				expect(screen.getByTestId("error")).toBeInTheDocument(),
			);
		});

		it("isSuspense 옵션이 true이고 fetch가 pending이면 Suspense fallback이 먼저 표시되고, fetch 완료 후 data가 표시된다.", async () => {
			const queryFn = jest.fn().mockResolvedValue("data");
			render(
				<Suspense fallback={<div data-testid="suspense">loading</div>}>
					<TestComponent queryFn={queryFn} isSuspense />
				</Suspense>,
			);
			expect(screen.getByTestId("suspense")).toBeInTheDocument();
			await waitFor(() =>
				expect(screen.getByTestId("data").textContent).toBe("data"),
			);
		});
	});

	describe("refetch 및 자동 갱신", () => {
		it("refetch 함수를 호출하면 쿼리 함수가 다시 실행되어 최신 데이터로 갱신된다.", async () => {
			let value = "first";
			const queryFn = jest
				.fn()
				.mockImplementation(() => Promise.resolve(value));
			render(<TestComponent queryFn={queryFn} />);
			await waitFor(() =>
				expect(screen.getByTestId("data").textContent).toBe("first"),
			);
			value = "second";
			act(() => {
				screen.getByText("refetch").click();
			});
			await waitFor(() =>
				expect(screen.getByTestId("data").textContent).toBe("second"),
			);
			expect(queryFn).toHaveBeenCalledTimes(2);
		});

		it("interval이 지나면 쿼리 함수가 자동으로 재실행되어 데이터가 갱신된다.", async () => {
			const queryFn = jest.fn().mockResolvedValue("interval");
			render(<TestComponent queryFn={queryFn} />);
			await waitFor(() =>
				expect(screen.getByTestId("status").textContent).toBe("success"),
			);
			act(() => {
				jest.advanceTimersByTime(5 * 60 * 1000); // 5분
			});
			await waitFor(() => expect(queryFn).toHaveBeenCalledTimes(2));
		});

		it("refetchOnWindowFocus 옵션이 true일 때 window focus 이벤트 발생 시 쿼리 함수가 재실행된다.", async () => {
			const queryFn = jest.fn().mockResolvedValue("focus");
			render(<TestComponent queryFn={queryFn} refetchOnWindowFocus />);
			await waitFor(() =>
				expect(screen.getByTestId("status").textContent).toBe("success"),
			);
			act(() => {
				window.dispatchEvent(new Event("focus"));
			});
			await waitFor(() => expect(queryFn).toHaveBeenCalledTimes(2));
		});

		it("refetchOnWindowFocus 옵션이 false면 window focus 이벤트 발생 시 쿼리 함수가 재실행되지 않는다.", async () => {
			const queryFn = jest.fn().mockResolvedValue("focus");
			render(<TestComponent queryFn={queryFn} refetchOnWindowFocus={false} />);
			await waitFor(() =>
				expect(screen.getByTestId("status").textContent).toBe("success"),
			);
			act(() => {
				window.dispatchEvent(new Event("focus"));
			});
			// 추가 호출 없음
			expect(queryFn).toHaveBeenCalledTimes(1);
		});

		it("refetchOnReconnect 옵션이 true일 때 online 이벤트 발생 시 쿼리 함수가 재실행된다.", async () => {
			const queryFn = jest.fn().mockResolvedValue("online");
			render(<TestComponent queryFn={queryFn} refetchOnReconnect />);
			await waitFor(() =>
				expect(screen.getByTestId("status").textContent).toBe("success"),
			);
			act(() => {
				window.dispatchEvent(new Event("online"));
			});
			await waitFor(() => expect(queryFn).toHaveBeenCalledTimes(2));
		});

		it("refetchOnReconnect 옵션이 false면 online 이벤트 발생 시 쿼리 함수가 재실행되지 않는다.", async () => {
			const queryFn = jest.fn().mockResolvedValue("online");
			render(<TestComponent queryFn={queryFn} refetchOnReconnect={false} />);
			await waitFor(() =>
				expect(screen.getByTestId("status").textContent).toBe("success"),
			);
			act(() => {
				window.dispatchEvent(new Event("online"));
			});
			expect(queryFn).toHaveBeenCalledTimes(1);
		});
	});

	describe("캐싱 및 클린업", () => {
		it("fetch가 진행 중일 때 중복 refetch 호출 시 쿼리 함수가 한 번만 실행되어 promise가 재사용된다.", async () => {
			let resolve: (v: string) => void;
			const queryFn = jest.fn().mockImplementation(
				() =>
					new Promise((res) => {
						resolve = res;
					}),
			);
			render(<TestComponent queryFn={queryFn} />);
			// fetch 중 여러 번 refetch
			act(() => {
				screen.getByText("refetch").click();
				screen.getByText("refetch").click();
			});
			// 아직 resolve 안 됨
			expect(queryFn).toHaveBeenCalledTimes(1);
			act(() => {
				resolve("done");
			});
			await waitFor(() =>
				expect(screen.getByTestId("data").textContent).toBe("done"),
			);
		});

		it("컴포넌트가 unmount될 때 interval과 window 이벤트 리스너가 정상적으로 해제된다.", async () => {
			const queryFn = jest.fn().mockResolvedValue("bye");
			const { unmount } = render(<TestComponent queryFn={queryFn} />);
			unmount();
			expect(clearInterval).toHaveBeenCalled();
			expect(window.removeEventListener).toHaveBeenCalled();
		});
	});
});
