import {API_URL, PRODUCTOS_MOCK} from "./constants";
import {BaseRecord, GetListParams, GetListResponse} from "@refinedev/core";


export const  dataProvider = ({
  getList:async<TData extends BaseRecord = BaseRecord>({resource}:GetListParams):Promise<GetListResponse<TData>> =>{
    if(resource!=="productos"){
      return {data:[] as TData[], total:0}
    }

    return {data:PRODUCTOS_MOCK as unknown as TData[], total:PRODUCTOS_MOCK.length};


  },
  getOne: async()=> {throw new Error("Function not implemented.")},
  create: async()=> {throw new Error("Function not implemented.")},
  update: async()=> {throw new Error("Function not implemented.")},
  deleteOne: async()=> {throw new Error("Function not implemented.")},

  getApiUrl:()=>API_URL,
});