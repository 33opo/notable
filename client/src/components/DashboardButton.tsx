import { Button } from "@mui/material";

function DashboardButton() {
	return (
		<Button
			href="/"
			variant="contained"
			color="info"
			style={{ zIndex: 10 }}
			sx={{
				":hover": {
					color: "white",
				},
			}}
		>
			Return to Dashboard
		</Button>
	);
}

export default DashboardButton;
//<DashboardButton />
