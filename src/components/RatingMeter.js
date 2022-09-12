import * as React from "react";
import { IconButton, Icon } from "@mui/material";
import { Star } from "@mui/icons-material";
import { useState, useEffect } from "react";

export default function RatingMeter({ initRating, parentCallback, editable }) {

    const [rating, setRating] = useState(initRating || 1);

    useEffect(() => setRating(initRating || 1), [initRating]);

    const handleStarClicked = (starID) => {
        setRating(starID);
        parentCallback(starID);
    }

    return editable ? (
        <div style={{"display": "inline-flex"}}>
            <IconButton onClick={() => handleStarClicked(1)} style={{"marginRight": -8}} color={rating > 0 ? "warning" : "default"}><Star/></IconButton>
            <IconButton onClick={() => handleStarClicked(2)} style={{"marginLeft": -8, "marginRight": -8}} color={rating > 1 ? "warning" : "default"}><Star/></IconButton>
            <IconButton onClick={() => handleStarClicked(3)} style={{"marginLeft": -8, "marginRight": -8}} color={rating > 2 ? "warning" : "default"}><Star/></IconButton>
            <IconButton onClick={() => handleStarClicked(4)} style={{"marginLeft": -8, "marginRight": -8}} color={rating > 3 ? "warning" : "default"}><Star/></IconButton>
            <IconButton onClick={() => handleStarClicked(5)} style={{"marginLeft": -8}} color={rating > 4 ? "warning" : "default"}><Star/></IconButton>
        </div>
    )
    : (
        <div style={{"display": "inline-flex"}}>
            <Star color={rating > 0 ? "warning" : "disabled"}/>
            <Star color={rating > 1 ? "warning" : "disabled"}/>
            <Star color={rating > 2 ? "warning" : "disabled"}/>
            <Star color={rating > 3 ? "warning" : "disabled"}/>
            <Star color={rating > 4 ? "warning" : "disabled"}/>
        </div>
    );
}