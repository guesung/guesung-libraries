import { Header } from "@/components";
import { useFunnelContext } from "@guesung/funnel";

export default function Step3Header() {
	const { goPrevStep } = useFunnelContext();

	return <Header onClick={goPrevStep} />;
}
