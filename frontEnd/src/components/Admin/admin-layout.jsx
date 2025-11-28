import { BookAIcon, Circle, CirclePlus, HomeIcon, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import Home from "../../pages/Home";


export default function AdminLayout() {
    const [open, setOpen] = useState(false)
    return  <div className="min-h-screen text-slate-900 bg-slate-100 z-30">
            <header className="sticky top-0 shadow-lg flex items-center  h-[70px] px-2 z-30 bg-amber-50 ">
                <button onClick={() => { setOpen(true) }} className="cursor-pointer md:hidden" >
                    <Menu aria-label="open sidebar" />
                </button>
                <h1 className="font-bold m-3 text-center px-2 "> Admin </h1>

            </header>
            <div className="flex mx-auto relative ">
            <aside className={` h-screen bg-slate-950 w-80 md:static  flex-col absolute left-0 transition-transform overflow-auto ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
                <button onClick={() => { setOpen(false) }} className="cursor-pointer absolute right-0.5 p-1 text-white md:hidden" >
                    <X aria-label="open closesidebar" />
                </button>
                <Link to={"/admin"}>
                    <div className="flex items-center gap-0.5 text-white m-4 ">
                        <BookAIcon /><p >all Books</p>
                    </div>

                </Link>
                <Link to={"/admin/addBook"}>
                    <div className="flex items-center gap-0.5 text-white m-4 ">
                        <CirclePlus /><p >add Book</p>
                    </div>

                </Link>
                <Link to={"/"}>
                    <div className="flex items-center gap-0.5 text-white m-4 ">
                        <HomeIcon /><p > redirect to home</p>
                    </div>

                </Link>
            </aside>

            <main className="w-full md:ml-20 md:p-6">
                <div className=" mx-auto max-w-4xl">
                    <Outlet />
                </div>

            </main>
        </div>
    </div>
}