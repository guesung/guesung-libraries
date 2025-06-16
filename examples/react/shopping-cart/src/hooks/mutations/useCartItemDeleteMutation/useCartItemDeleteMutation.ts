import { CartItemApi, type DeleteCartItemsParams } from "@/apis";
import { useMutation } from "@guesung/query";

export default function useCartItemDeleteMutation() {
	return useMutation<DeleteCartItemsParams, void>({
		mutationFn: CartItemApi.deleteCartItems,
	});
}
