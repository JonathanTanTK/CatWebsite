import React, { useContext, useState } from 'react';
import BadgerBudsDataContext from "../contexts/BadgerBudsDataContext.js"; // Import the context to access the cat data
import { Container, Row, Col, Button } from 'react-bootstrap';

export default function BadgerBudsBasketSummary(props) {
    const buds = useContext(BadgerBudsDataContext); // Get the cat data from the context
    const [refreshcounter, setRefreshCounter] = useState(0) // This is a hack to force a refresh when the user clicks "Save" on a cat

    let savedCatIds = JSON.parse(sessionStorage.getItem('savedCatIds'));
    let adoptedCatIds = JSON.parse(sessionStorage.getItem('adoptedCatIds'));
    if (savedCatIds === null) {
        sessionStorage.setItem('savedCatIds', JSON.stringify([]));
        savedCatIds = JSON.parse(sessionStorage.setItem('savedCatIds', JSON.stringify([])));
    }
    if (adoptedCatIds === null) {
        sessionStorage.setItem('adoptedCatIds', JSON.stringify([]));
        adoptedCatIds = JSON.parse(sessionStorage.setItem('adoptedCatIds', JSON.stringify([])));
    }

    // find the saved cats from the buds array using the saved cat ids
    let savedCats = buds.filter(bud => savedCatIds.includes(bud.id));

    // function to remove a cat from the basket
    function handleUnselect(bud) {
        alert(`${bud.name} has been removed from your basket!`);
        // Get the saved cat ids from sessionStorage
        let savedCatIds = JSON.parse(sessionStorage.getItem("savedCatIds"));
        // Remove the saved cat from the savedCatIds array
        // search for the index of the saved cat id
        let index = savedCatIds.indexOf(bud.id);
        // remove the saved cat id from the array
        savedCatIds.splice(index, 1)
        // Remove the saved cat from the buds array
        sessionStorage.setItem("savedCatIds", JSON.stringify(savedCatIds));
        // Force a refresh of the component
        setRefreshCounter(refreshcounter + 1);
    }

    // function to adopt a cat
    function handleAdopt(bud){
        adoptedCatIds.push(bud.id);
        sessionStorage.setItem("adoptedCatIds", JSON.stringify(adoptedCatIds));
        alert(`${bud.name} has been adopted!`);
        // remove adopted cat from saved cats
        let savedCatIds = JSON.parse(sessionStorage.getItem("savedCatIds"));
        // Remove the saved cat from the savedCatIds array
        // search for the index of the saved cat id
        let index = savedCatIds.indexOf(bud.id);
        // remove the saved cat id from the array
        savedCatIds.splice(index, 1)
        sessionStorage.setItem("savedCatIds", JSON.stringify(savedCatIds));
        // Force a refresh of the component
        setRefreshCounter(refreshcounter + 1);
    }

    /**
     * ### Step 9: Handle No Buds

    On the "Available Cats" page, if there are no available buds (e.g. all have been saved or adopted), display 
    "No buds are available for adoption!"

    Likewise, on the "My Basket" page, if there are no saved buds, display "You have no buds in your basket!"
     */
    if (savedCatIds.length === 0) {
        return <p>You have no buds in your basket!</p>;
    }

    return <Container>
    <Row>
        {
            // display all saved cats
            savedCats.map(bud => {
                if (!adoptedCatIds.includes(bud.id)) {
                    return <Col key={bud.id} xs={12} md={6} lg={4} xl={3} style={{ marginBottom: "1rem" }}>
                        <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "5px" }}>
                            <h3>{bud.name}</h3>
                            <img
                                src={`https://raw.githubusercontent.com/CS571-F23/hw5-api-static-content/main/cats/${bud.imgIds[0]}`}
                                alt={`A picture of ${bud.name}`}
                                style={{ aspectRatio: '1/1', width: '100%' }} />
                            <Button onClick={() => handleUnselect(bud)}>Unselect</Button>
                            <Button variant="primary" onClick={() => handleAdopt(bud)}>Adopt</Button>
                        </div>
                    </Col>
                }
            })
        }
        </Row>
    </Container>
}