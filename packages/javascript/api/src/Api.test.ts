import { Api } from "./index";

describe("Api 클래스", () => {
	const baseUrl = "https://api.example.com";
	let api: Api;
	let fetchMock: jest.Mock;

	beforeEach(() => {
		api = new Api(baseUrl);
		fetchMock = jest.fn();
		global.fetch = fetchMock;
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	describe("생성자", () => {
		it("생성자 호출 시 baseUrl과 defaultOptions가 정상적으로 설정된다.", () => {
			const api2 = new Api("/test", { headers: { foo: "bar" } });
			expect(api2).toBeInstanceOf(Api);
		});
	});

	describe("get 메서드", () => {
		it("get 메서드가 정상적으로 GET 요청을 보내고, 응답이 ok=true이면 json 데이터를 반환한다.", async () => {
			fetchMock.mockResolvedValue({
				ok: true,
				json: () => Promise.resolve({ data: 123 }),
				status: 200,
				statusText: "OK",
			});
			const result = await api.get("/foo");
			expect(fetchMock).toHaveBeenCalledWith(
				`${baseUrl}/foo`,
				expect.objectContaining({ method: "GET" }),
			);
			expect(result).toEqual({ data: 123 });
		});
		it("get 메서드가 ok=false인 응답을 받으면 status와 statusText를 포함한 에러를 throw한다.", async () => {
			fetchMock.mockResolvedValue({
				ok: false,
				status: 404,
				statusText: "Not Found",
			});
			await expect(api.get("/fail")).rejects.toThrow("404 Not Found");
		});
	});

	describe("post 메서드", () => {
		it("post 메서드가 정상적으로 POST 요청을 보내고, body를 전달하면 ok=true 응답 시 undefined를 반환한다.", async () => {
			fetchMock.mockResolvedValue({
				ok: true,
				status: 201,
				statusText: "Created",
			});
			await expect(
				api.post("/bar", { body: { a: 1 } }),
			).resolves.toBeUndefined();
			expect(fetchMock).toHaveBeenCalledWith(
				`${baseUrl}/bar`,
				expect.objectContaining({
					method: "POST",
					body: JSON.stringify({ a: 1 }),
				}),
			);
		});
		it("post 메서드가 ok=false인 응답을 받으면 status와 statusText를 포함한 에러를 throw한다.", async () => {
			fetchMock.mockResolvedValue({
				ok: false,
				status: 400,
				statusText: "Bad Request",
			});
			await expect(api.post("/fail", { body: { b: 2 } })).rejects.toThrow(
				"400 Bad Request",
			);
		});
	});

	describe("put 메서드", () => {
		it("put 메서드가 정상적으로 PUT 요청을 보내고, body를 전달하면 ok=true 응답 시 undefined를 반환한다.", async () => {
			fetchMock.mockResolvedValue({ ok: true, status: 200, statusText: "OK" });
			await expect(
				api.put("/baz", { body: { c: 3 } }),
			).resolves.toBeUndefined();
			expect(fetchMock).toHaveBeenCalledWith(
				`${baseUrl}/baz`,
				expect.objectContaining({
					method: "PUT",
					body: JSON.stringify({ c: 3 }),
				}),
			);
		});
		it("put 메서드가 ok=false인 응답을 받으면 status와 statusText를 포함한 에러를 throw한다.", async () => {
			fetchMock.mockResolvedValue({
				ok: false,
				status: 500,
				statusText: "Server Error",
			});
			await expect(api.put("/fail", { body: { d: 4 } })).rejects.toThrow(
				"500 Server Error",
			);
		});
	});

	describe("patch 메서드", () => {
		it("patch 메서드가 정상적으로 PATCH 요청을 보내고, body를 전달하면 ok=true 응답 시 undefined를 반환한다.", async () => {
			fetchMock.mockResolvedValue({ ok: true, status: 200, statusText: "OK" });
			await expect(
				api.patch("/patch", { body: { e: 5 } }),
			).resolves.toBeUndefined();
			expect(fetchMock).toHaveBeenCalledWith(
				`${baseUrl}/patch`,
				expect.objectContaining({
					method: "PATCH",
					body: JSON.stringify({ e: 5 }),
				}),
			);
		});
		it("patch 메서드가 ok=false인 응답을 받으면 status와 statusText를 포함한 에러를 throw한다.", async () => {
			fetchMock.mockResolvedValue({
				ok: false,
				status: 403,
				statusText: "Forbidden",
			});
			await expect(api.patch("/fail", { body: { f: 6 } })).rejects.toThrow(
				"403 Forbidden",
			);
		});
	});

	describe("delete 메서드", () => {
		it("delete 메서드가 정상적으로 DELETE 요청을 보내고, body를 전달하면 ok=true 응답 시 undefined를 반환한다.", async () => {
			fetchMock.mockResolvedValue({
				ok: true,
				status: 204,
				statusText: "No Content",
			});
			await expect(
				api.delete("/del", { body: { g: 7 } }),
			).resolves.toBeUndefined();
			expect(fetchMock).toHaveBeenCalledWith(
				`${baseUrl}/del`,
				expect.objectContaining({
					method: "DELETE",
					body: JSON.stringify({ g: 7 }),
				}),
			);
		});
		it("delete 메서드가 ok=false인 응답을 받으면 status와 statusText를 포함한 에러를 throw한다.", async () => {
			fetchMock.mockResolvedValue({
				ok: false,
				status: 401,
				statusText: "Unauthorized",
			});
			await expect(api.delete("/fail", { body: { h: 8 } })).rejects.toThrow(
				"401 Unauthorized",
			);
		});
	});
});
