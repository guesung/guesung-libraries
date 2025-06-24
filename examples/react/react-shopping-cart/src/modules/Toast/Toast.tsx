import { CheckIcon } from "@/components";
import * as S from "./Toast.styles";

import { type ToastVariant, useToast } from "./ToastProvider";
interface ToastProps {
	id: number;
	variant: ToastVariant;
	message: string;
	duration?: number;
}

export default function Toast({
	id,
	variant,
	message,
	duration = 3000,
}: ToastProps) {
	const { hideToast } = useToast();

	const handleTransitionEnd = () => {
		hideToast(id);
	};

	return (
		<S.Toast
			variant={variant}
			duration={duration}
			onAnimationEnd={handleTransitionEnd}
			onTransitionEnd={handleTransitionEnd}
		>
			<S.ToastIcon>
				<CheckIcon />
			</S.ToastIcon>
			<S.ToastMessage>{message}</S.ToastMessage>
			<S.ToastClose onClick={() => hideToast(id)}>&times;</S.ToastClose>
		</S.Toast>
	);
}
