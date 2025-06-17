import { ProductApi } from "@/apis";
import { QUERY_KEY } from "@/constants";
import { useQuery } from "@guesung/query";

export default function useProductQuery() {
	return useQuery({
		queryFn: ProductApi.getAllProducts,
		queryKey: QUERY_KEY.product,
		initialData: { content: [] },
	});
}
