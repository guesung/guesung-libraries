import { CartItemApi, type PostCartItemsParams } from "@/apis";
import { useMutation } from "@guesung/query";

export default function useCartItemPostMutation() {
	return useMutation<PostCartItemsParams, void>({
		mutationFn: CartItemApi.postCartItems,
	});
}
