import {Refine} from "@refinedev/core";
import {DevtoolsPanel, DevtoolsProvider} from "@refinedev/devtools";
import {RefineKbar, RefineKbarProvider} from "@refinedev/kbar";

import routerProvider, {
    DocumentTitleHandler,
    UnsavedChangesNotifier,
} from "@refinedev/react-router";
import {BrowserRouter, Outlet, Route, Routes} from "react-router";
import "./App.css";
import {Toaster} from "./components/refine-ui/notification/toaster";
import {useNotificationProvider} from "./components/refine-ui/notification/use-notification-provider";
import {ThemeProvider} from "./components/refine-ui/theme/theme-provider";
import {dataProvider} from "./providers/data";
import {Layout} from "@/components/refine-ui/layout/layout.tsx";
import {Candy, Factory, Home, Container} from "lucide-react";
import Dashboard from "@/pages/dashboard.tsx";
import ProductosList from "@/pages/productos/list.tsx";
import ProductosCreate from "@/pages/productos/create.tsx";
import LotesList from "@/pages/lotes/list.tsx";
import LotesCreate from "@/pages/lotes/create.tsx";
import InventarioList from "@/pages/inventario/list.tsx";
import InventarioCreate from "@/pages/inventario/create.tsx";
import ProductosEdit from "@/pages/productos/edit.tsx";


function App() {
    return (
        <BrowserRouter>

            <RefineKbarProvider>
                <ThemeProvider>
                    <DevtoolsProvider>
                        <Refine
                            dataProvider={dataProvider}
                            notificationProvider={useNotificationProvider()}
                            routerProvider={routerProvider}
                            options={{
                                syncWithLocation: true,
                                warnWhenUnsavedChanges: true,
                                projectId: "t11Vd0-0npbbM-E62ZiO",
                            }}

                            resources={[
                                {
                                    name: 'dashboard',
                                    list: '/',
                                    meta: {label: 'Home', icon: <Home/>}
                                },
                                {
                                    name: 'productos',
                                    list: '/productos',
                                    create: '/productos/create',
                                    edit:"/productos/edit/:id",
                                    meta: {label: 'Productos', icon: <Candy/>}


                                },
                                {
                                    name: "lotes",
                                    list: "/lotes",
                                    create: "/lotes/create",
                                    meta: {label: "Lotes de Producción", icon: <Factory/>}
                                },
                                {
                                    name: "inventario",
                                    list: "/inventario",
                                    create: "/inventario/create",
                                    meta: {label: "Inventario", icon: <Container/>}
                                }


                            ]}
                        >
                            <Routes>
                                <Route element={<Layout>
                                    <Outlet/>
                                </Layout>}>
                                    <Route path={"/"} element={<Dashboard/>}/>
                                    <Route path={"/productos"}>
                                        <Route index element={<ProductosList/>}/>
                                        <Route path={"create"} element={<ProductosCreate/>}/>
                                        <Route path={"edit/:id"} element={<ProductosEdit/>}/>

                                    </Route>

                                    <Route path={"/lotes"}>
                                        <Route index element={<LotesList/>}/>
                                        <Route path={"create"} element={<LotesCreate/>}/>

                                    </Route>

                                    <Route path={"/inventario"}>
                                        <Route index element={<InventarioList/>}/>
                                        <Route path={"create"} element={<InventarioCreate/>}/>

                                    </Route>


                                </Route>


                            </Routes>
                            <Toaster/>
                            <RefineKbar/>
                            <UnsavedChangesNotifier/>
                            <DocumentTitleHandler/>
                        </Refine>
                        <DevtoolsPanel/>
                    </DevtoolsProvider>
                </ThemeProvider>
            </RefineKbarProvider>
        </BrowserRouter>
    );
}

export default App;
