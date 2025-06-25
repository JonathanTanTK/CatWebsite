import {useContext, useState} from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import Carousel from 'react-bootstrap/Carousel';
import BadgerBudsDataContext from "../contexts/BadgerBudsDataContext.js"; // Import the context to access the cat data

export default function BadgerBudSummary(props) {

    const buds = useContext(BadgerBudsDataContext); // Get the cat data from the context

    let savedCatIds = JSON.parse(sessionStorage.getItem("savedCatIds"));
    if (savedCatIds === null) {
        sessionStorage.setItem("savedCatIds", JSON.stringify([]));
        savedCatIds = JSON.parse(sessionStorage.setItem("savedCatIds", JSON.stringify([])));
    }

    let adoptedCatIds = JSON.parse(sessionStorage.getItem("adoptedCatIds"));
    if (adoptedCatIds === null) {
        sessionStorage.setItem("adoptedCatIds", JSON.stringify([]));
        adoptedCatIds = JSON.parse(sessionStorage.setItem("adoptedCatIds", JSON.stringify([])));
    }

    const maxCats = buds.length;
    const [showMore, setShowMore] = useState({})
    const [refreshcounter, setRefreshCounter] = useState(0) // This is a hack to force a refresh when the user clicks "Save" on a cat

    const toggleExpand = (id) => {
        setShowMore({ ...showMore, [id]: !showMore[id] })
    }

    function handleSave(props) {
        alert(`${props.name} has been added to your basket!`);
        
        // Get the saved cat ids from sessionStorage
        // let savedCatIds = sessionStorage.getItem("savedCatIds");
        
        // Parse the saved cat ids as an array or initialize as an empty array
        let savedCatIds = JSON.parse(sessionStorage.getItem("savedCatIds"));
        if (savedCatIds === null) {
            sessionStorage.setItem("savedCatIds", JSON.stringify([]));
            savedCatIds = JSON.parse(sessionStorage.setItem("savedCatIds", JSON.stringify([])));
        }
        
        // Add the id of the saved cat to the savedCatIds array
        savedCatIds.push(props.id);
        // Remove the saved cat from the buds array
        sessionStorage.setItem("savedCatIds", JSON.stringify(savedCatIds));
        // setBuds((prevBuds) => prevBuds.filter((prevBud) => prevBud.id !== bud.id));
        // Force a refresh of the component
        setRefreshCounter(refreshcounter + 1);
    };


    const printAge = (months) => {
        if (months >= 12) {
            const years = Math.floor(months / 12);
            const remainingMonths = months % 12;
            if (remainingMonths === 0) {
              return `${years} year(s) old`;
            } else {
              return `${years} year(s) and ${remainingMonths} month(s) old`;
            }
          } else {
            return `${months} month(s) old`;
          }
    };

    if (adoptedCatIds.length + savedCatIds.length === maxCats) {
        return <p>No buds are available for adoption!</p>;
    }

        return <Container>
            <Row>
                {
                    // Display each cat in a card, except for saved cats
                    buds.map(bud => {
                        if (!sessionStorage.getItem("savedCatIds").includes(bud.id) && !sessionStorage.getItem("adoptedCatIds").includes(bud.id)) {
                            return <Col key={bud.id} xs={12} md={6} lg={4} xl={3} style={{ marginBottom: "1rem" }}>
                                <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "5px" }}>
                                    <h3>{bud.name}</h3>
                                    {showMore[bud.id] ? (
                                    <Carousel>
                                        {bud.imgIds.map((imgId) => (
                                            <Carousel.Item key={imgId}>
                                                <img
                                                    src={`https://raw.githubusercontent.com/CS571-F23/hw5-api-static-content/main/cats/${imgId}`}
                                                    alt={`A picture of ${bud.name}`}
                                                    style={{ aspectRatio: '1/1', width: '100%' }}
                                                />
                                            </Carousel.Item>
                                        ))}
                                    </Carousel>
                                    ) : (
                                    <img
                                    src={`https://raw.githubusercontent.com/CS571-F23/hw5-api-static-content/main/cats/${bud.imgIds[0]}`}
                                    alt={`A picture of ${bud.name}`}
                                    style={{ aspectRatio: '1/1', width: '100%' }}
                                    />
                                    )}
                                {showMore[bud.id] ? (
                                    // Display additional cat details when expanded
                                    <div>
                                        <p>Gender: {bud.gender}</p>
                                        <p>Breed: {bud.breed}</p>
                                        <p>Age: {printAge(bud.age)}</p>
                                        {bud.description && <p>Description: {bud.description}</p>}
                                        <Button onClick={() => toggleExpand(bud.id)}>Show Less</Button>
                                    </div>
                                    ) : (
                                    // Show more button when not expanded
                                    <Button onClick={() => toggleExpand(bud.id)}>Show More</Button>
                                )}
                                <Button onClick={() => handleSave(bud)}>Save</Button>
                                </div>
                            </Col>
                        }
                    })
                }
            </Row>
    </Container>
}