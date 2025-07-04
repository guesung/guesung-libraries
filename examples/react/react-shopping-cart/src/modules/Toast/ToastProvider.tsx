import {
	type PropsWithChildren,
	createContext,
	useCallback,
	useContext,
	useRef,
	useState,
} from "react";
import Toast from "./Toast";
import * as S from "./Toast.styles";

export type ToastVariant = "success" | "error";
type ToastType = {
	id: number;
	variant: ToastVariant;
	message: string;
	duration?: number;
};

interface ToastContextType {
	toasts: ToastType[];
	showToast: (toast: Omit<ToastType, "id">) => void;
	hideToast: (id: number) => void;
}

export const ToastContext = createContext<ToastContextType | null>(null);

export default function ToastProvider({ children }: PropsWithChildren) {
	const [toasts, setToasts] = useState<ToastType[]>([]);
	const idRef = useRef(0);

	const showToast = useCallback((toast: Omit<ToastType, "id">) => {
		setToasts((prev) => [...prev, { ...toast, id: idRef.current++ }]);
	}, []);

	const hideToast = useCallback((id: number) => {
		setToasts((prev) => prev.filter((toast) => toast.id !== id));
	}, []);

	return (
		<ToastContext.Provider value={{ toasts, showToast, hideToast }}>
			<S.ToastContainer>
				{toasts.map(({ id, ...toastProps }) => (
					<Toast key={id} id={id} {...toastProps} />
				))}
			</S.ToastContainer>
			{children}
		</ToastContext.Provider>
	);
}

export const useToast = () => {
	const value = useContext(ToastContext);

	if (value === null)
		throw new Error(
			"ToastContext value must be used within a ToastProvider Component!!",
		);

	return value;
};
