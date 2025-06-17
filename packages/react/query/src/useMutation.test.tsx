import { renderHook, act, waitFor } from "@testing-library/react";
import useMutation from "./useMutation";

describe("useMutation", () => {
	it("useMutation 훅을 사용하면 초기 status가 idle로 설정된다.", () => {
		const { result } = renderHook(() =>
			useMutation({ mutationFn: async () => {} }),
		);
		expect(result.current.status).toBe("idle");
	});

	it("mutate 함수를 호출하면 status가 pending에서 success로 바뀌고, mutationFn이 올바르게 호출된다.", async () => {
		const mutationFn = jest.fn().mockResolvedValue("ok");
		const { result } = renderHook(() => useMutation({ mutationFn }));
		act(() => {
			result.current.mutate("foo");
		});
		expect(result.current.status).toBe("pending");
		await waitFor(() => {
			expect(result.current.status).toBe("success");
		});
		expect(mutationFn).toHaveBeenCalledWith("foo");
	});

	it("mutate 함수 실행 시 에러가 발생하면 status가 error로 바뀌고, 에러가 throw된다.", async () => {
		const error = new Error("fail");
		const mutationFn = jest.fn().mockRejectedValue(error);
		const { result } = renderHook(() => useMutation({ mutationFn }));
		let thrown = null;
		await act(async () => {
			try {
				await result.current.mutate("foo");
			} catch (e) {
				thrown = e;
			}
		});
		expect(result.current.status).toBe("error");
		expect(thrown).toBe(error);
	});

	it("onMutate, onSuccess, onSettled 콜백이 mutate 실행 시 올바르게 호출된다.", async () => {
		const mutationFn = jest.fn().mockResolvedValue("ok");
		const onMutate = jest.fn();
		const onSuccess = jest.fn();
		const onSettled = jest.fn();
		const { result } = renderHook(() =>
			useMutation({ mutationFn, onMutate, onSuccess, onSettled }),
		);
		act(() => {
			result.current.mutate("foo");
		});
		expect(onMutate).toHaveBeenCalled();
		await waitFor(() => {
			expect(onSuccess).toHaveBeenCalled();
			expect(onSettled).toHaveBeenCalled();
		});
	});

	it("mutate 함수의 옵션 콜백들도 실행 시 올바르게 호출된다.", async () => {
		const mutationFn = jest.fn().mockResolvedValue("ok");
		const onMutate = jest.fn();
		const onSuccess = jest.fn();
		const onSettled = jest.fn();
		const { result } = renderHook(() => useMutation({ mutationFn }));
		act(() => {
			result.current.mutate("foo", { onMutate, onSuccess, onSettled });
		});
		expect(onMutate).toHaveBeenCalled();
		await waitFor(() => {
			expect(onSuccess).toHaveBeenCalled();
			expect(onSettled).toHaveBeenCalled();
		});
	});

	it("onError 콜백이 에러 발생 시 올바르게 호출된다.", async () => {
		const error = new Error("fail");
		const mutationFn = jest.fn().mockRejectedValue(error);
		const onError = jest.fn();
		const { result } = renderHook(() => useMutation({ mutationFn, onError }));
		await act(async () => {
			try {
				await result.current.mutate("foo");
			} catch {}
		});
		expect(onError).toHaveBeenCalledWith(error);
	});
});
