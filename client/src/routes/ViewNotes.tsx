import axios from "axios";
import { Link } from "react-router-dom";
import { useEffect, useState, useReducer } from "react";
import { Presentation, User } from "../types";
import { Button, Container } from "@mui/material";
import Sidebar from "../components/Sidebar";
import { isNull } from "lodash";

const client = axios.create({
	headers: {
		Authorization: `Bearer ${localStorage.getItem("token")}`,
	},
});

const ViewNotes = () => {
	const [presentations, setPresentations] = useState<Presentation[]>([]);
	const [reducerValue, forceUpdate] = useReducer((x) => x + 1, 0);
	const user: User = JSON.parse(localStorage.getItem("user")!);

	useEffect(() => {
		getPresentationWithNotes().then((notepresentations) => {
			setPresentations(notepresentations);
		});
	}, [reducerValue]);

	const deleteNote = (
		presenter_id: number,
		presentation_instance_id: number
	) => {
		if (presenter_id === user.id) {
			if (window.confirm("Are you sure you want to delete this note?")) {
				client
					.delete(`/api/presentation/${presentation_instance_id}`)
					.then((res) => {
						alert("Presentation Deleted!");
						console.log(res.data);
						forceUpdate();
					})
					.catch((err) => alert("invalid presentation: " + err.message));
			}
		} else {
			if (window.confirm("Are you sure you want to delete this note?")) {
				client
					.delete(`/api/presentationNotes/${presentation_instance_id}`)
					.then((res) => {
						alert("Presentation Note Deleted!");
						console.log(res.data);
						forceUpdate();
					})
					.catch((err) => alert("invalid presentation: " + err.message));
			}
		}
	};

	const changeNote = (event: {
		currentTarget: {
			value: any;
		};
	}) => {
		const youtube_url = prompt("Please enter the youtube url");

		console.log(event.currentTarget.value);
		if (youtube_url != null) {
			const formData = new FormData();
			formData.append("youtube_url", youtube_url);
			formData.append("presentation_instance_id", event.currentTarget.value);

			client
				.put("/api/changePresentation", formData)
				.then((res) => {
					alert("Presentation Note Changed!");
					console.log(res.data);
					forceUpdate();
				})
				.catch((err) => alert("invalid presentation: " + err.message));
		}
	};

	return (
		<div>
			<Sidebar />
			<div id="containerIfSidebar">
				<Container>
					<div id="viewNotesWithBacking"></div>
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
									<p>{presentation.presentation_instance_id}</p>
								</Link>
								<Button
									id="deletebutton"
									value={presentation.presentation_instance_id}
									onClick={() =>
										deleteNote(
											presentation.presenter_id,
											presentation.presentation_instance_id
										)
									}
								></Button>
								{presentation.pdf != null &&
									presentation.presenter_id === user.id && (
										<Button
											id="editbutton"
											value={presentation.presentation_instance_id}
											onClick={changeNote}
										></Button>
									)}
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
