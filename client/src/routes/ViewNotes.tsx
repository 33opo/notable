import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useReducer } from "react";
import { Presentation, User } from "../types";
import { Button, Container } from "@mui/material";
import Sidebar from "../components/Sidebar";

const client = axios.create({
	headers: {
		Authorization: `Bearer ${localStorage.getItem("token")}`,
	},
});

const ViewNotes = () => {
	const navigate = useNavigate();
	const [presentations, setPresentations] = useState<Presentation[]>([]);
	const [reducerValue, forceUpdate] = useReducer((x) => x + 1, 0);
	const user: User = JSON.parse(localStorage.getItem("user")!);

	if (user.id === undefined) {
		localStorage.clear();
		navigate("/");
	}

	useEffect(() => {
		getPresentationWithNotes().then((notepresentations) => {
			setPresentations(notepresentations);
		});
	}, [reducerValue]);

	const deleteNote = (presentation_instance_id: number) => {
		if (window.confirm("Are you sure you want to delete this note?")) {
			client
				.delete(`/api/presentationNotes/${presentation_instance_id}`)
				.then((res) => {
					alert("Presentation note deleted!");
					console.log(res.data);
					forceUpdate();
				})
				.catch((err) => alert("invalid presentation: " + err.message));
		}
	};

	return (
		<div data-testid="ViewNotes-component">
			<Sidebar />
			<div id="containerIfSidebar">
				<div id="viewNotesWithBacking"></div>
				<Container>
					<div>
						<div id="pageHead">
							<h1>View Notes</h1>
						</div>
						{presentations.length === 0 && (
							<div id="middlePanelSmall">
								<h2>
									<br></br>
									You have no notes
									<br></br>
									<br></br>
								</h2>
								<h5>Notes that you take in presentations will show up here!</h5>
							</div>
						)}
					</div>
					<div id="noteSets_container">
						{presentations.map((presentation) => (
							<div key={presentation.presentation_instance_id}>
								<Link
									to={`/room/${presentation.presentation_instance_id}`}
									id="noteSet"
								>
									<p>{presentation.title}</p>
									{presentation.presenter_id === user.id && (
										<div>Presenter View</div>
									)}
									<p>{presentation.presentation_instance_id}</p>
								</Link>
								<Button
									id="deletebuttonsmall"
									value={presentation.presentation_instance_id}
									onClick={() =>
										deleteNote(presentation.presentation_instance_id)
									}
								></Button>
							</div>
						))}
					</div>
				</Container>
			</div>
		</div>
	);
};

async function getPresentationWithNotes(): Promise<Presentation[]> {
	const response = await client.get("/api/notePresentations/");
	return response.data;
}
export default ViewNotes;
