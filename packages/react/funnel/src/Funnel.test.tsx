import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Funnel, { useFunnelContext } from "./Funnel";
import { act } from "react";

describe("Funnel", () => {
	test("Funnel 컴포넌트가 initialStep에 해당하는 Step만 렌더링한다.", () => {
		render(
			<Funnel initialStep={2}>
				<Funnel.Step index={1}>Step1</Funnel.Step>
				<Funnel.Step index={2}>Step2</Funnel.Step>
			</Funnel>,
		);
		expect(screen.queryByText("Step1")).toBeNull();
		expect(screen.getByText("Step2")).toBeInTheDocument();
	});

	describe("resetStep 함수", () => {
		function ResetButton() {
			const { resetStep } = useFunnelContext();
			return (
				<button type="button" onClick={resetStep}>
					Reset
				</button>
			);
		}

		test("resetStep 함수를 호출하면 step이 initialStep 값으로 되돌아간다.", async () => {
			history.pushState(null, "", "?step=3"); // Step3가 보이도록 쿼리스트링 세팅
			render(
				<Funnel initialStep={2}>
					<Funnel.Step index={2}>Step2</Funnel.Step>
					<Funnel.Step index={3}>
						Step3
						<ResetButton />
					</Funnel.Step>
				</Funnel>,
			);
			expect(screen.getByText("Step3")).toBeInTheDocument();
			await waitFor(() => {
				fireEvent.click(screen.getByText("Reset"));
			});
			await waitFor(() => {
				expect(screen.getByText("Step2")).toBeInTheDocument();
			});
		});

		test("popstate 이벤트가 발생하면 step이 쿼리스트링의 step 값에 맞게 변경된다.", async () => {
			history.pushState(null, "", "?step=1");
			const { getByRole } = render(
				<Funnel initialStep={1}>
					<Funnel.Step index={1}>
						Step1
						<GoNextStepButton />
					</Funnel.Step>
					<Funnel.Step index={2}>Step2</Funnel.Step>
				</Funnel>,
			);

			await waitFor(() => {
				expect(
					getByRole("button", { name: "Go Next Step" }),
				).toBeInTheDocument();
			});

			fireEvent.click(getByRole("button", { name: "Go Next Step" }));

			await waitFor(() => {
				expect(screen.getByText("Step2")).toBeInTheDocument();
			});

			history.back();

			await waitFor(() => {
				expect(screen.getByText("Step1")).toBeInTheDocument();
			});
		});

		test("FunnelContext를 Provider 없이 사용하면 에러가 발생한다.", () => {
			function BadComponent() {
				useFunnelContext();
				return null;
			}
			expect(() => render(<BadComponent />)).toThrow();
		});
	});

	test("goNextStep 함수를 호출하면 다음 step으로 이동하여 해당 Step이 렌더링된다.", async () => {
		history.pushState(null, "", "?step=1");
		const { getByRole } = render(
			<Funnel initialStep={1}>
				<Funnel.Step index={1}>
					<GoNextStepButton />
				</Funnel.Step>
				<Funnel.Step index={2}>Step2</Funnel.Step>
			</Funnel>,
		);
		await waitFor(() => {
			expect(getByRole("button", { name: "Go Next Step" })).toBeInTheDocument();
		});
		fireEvent.click(getByRole("button", { name: "Go Next Step" }));
		await waitFor(() => {
			expect(screen.getByText("Step2")).toBeInTheDocument();
		});
	});

	test("goPrevStep 함수를 호출하면 이전 step으로 이동하여 해당 Step이 렌더링된다.", () => {
		const { getByRole } = render(
			<Funnel initialStep={2}>
				<Funnel.Step index={1}>Step1</Funnel.Step>
				<Funnel.Step index={2}>
					<GoPrevStepButton />
				</Funnel.Step>
			</Funnel>,
		);

		fireEvent.click(getByRole("button", { name: "Go Prev Step" }));
		expect(screen.getByText("Step1")).toBeInTheDocument();
	});
});

function GoNextStepButton() {
	const { goNextStep } = useFunnelContext();
	return (
		<button type="button" onClick={goNextStep}>
			Go Next Step
		</button>
	);
}

function GoPrevStepButton() {
	const { goPrevStep } = useFunnelContext();
	return (
		<button type="button" onClick={goPrevStep}>
			Go Prev Step
		</button>
	);
}
