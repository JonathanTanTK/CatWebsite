import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import BadgerBudsNavbar from "./nav/BadgerBudsNavbar";
import BadgerBudsDataContext from "../contexts/BadgerBudsDataContext";

export default function BadgerBuds() {

    const [buds, setBuds] = useState([]);

    useEffect(() => {
        fetch('https://cs571.org/api/s25/hw5/buds', {
            headers: {
                "X-CS571-ID": "bid_e3d18daa93d5f90917e5a31125fe05886977e2537eb1ed7269a0803ed6fe2e01"
            }
        })
            .then(res => res.json())
            .then(cats => {
                setBuds(cats)
            })
    }, []);

    return (
        <div>
            <BadgerBudsNavbar />
            <div style={{ margin: "1rem" }}>
                <BadgerBudsDataContext.Provider value={buds}>
                    <Outlet />
                </BadgerBudsDataContext.Provider>
            </div>
            
        </div>
    );
}