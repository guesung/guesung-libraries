import { CartItemApi, type PostCartItemsParams } from "@/apis";
import { useMutation } from "@/modules/Query";

export default function useCartItemPostMutation() {
	return useMutation<PostCartItemsParams, void>({
		mutationFn: CartItemApi.postCartItems,
	});
}
