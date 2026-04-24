
import {createDataProvider, CreateDataProviderOptions} from "@refinedev/rest";
import {ListResponse} from "@/types";
import {BACKEND_BASE_URL} from "@/constants";


const options: CreateDataProviderOptions = {
    getList: {
        getEndpoint: ({resource}) => resource,

        buildQueryParams: async ({resource,pagination,filters})=>{
            const page = pagination?.currentPage??1;
            const pageSize = pagination?.pageSize??10;
            const params :Record<string,string|number>={page,limit:pageSize};

            filters?.forEach((filter)=>{
                const field = 'field' in filter ? filter.field:'';
                const value = String (filter.value);
                if (resource==="productos"){
                    if(field==="tipo") params.tipo=value;
                    if(field==="sabor") params.search=value;

                }


                if (resource === "lotes") {
                    if (field === "tipo") params.tipo = value;
                    if (field === "search") params.search = value;
                    if (field === "date") params.date = value;
                    if (field === "startDate") params.startDate = value;
                    if (field === "endDate") params.endDate = value;
                }
            })
            return params;
        },

        mapResponse: async (response) => {
            const payload: ListResponse = (response as any)._cached
                ?? ((response as any)._cached = await response.json());
            return payload.data ?? [];
        },

        getTotalCount: async (response) => {
            const payload: ListResponse = (response as any)._cached
                ?? ((response as any)._cached = await response.json());
            return payload.pagination?.total ?? payload.data?.length ?? 0;
        },

    }
}




const {dataProvider} = createDataProvider(BACKEND_BASE_URL,options);
export {dataProvider};