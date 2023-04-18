import { getLeagueById, League } from "csgo-predict-api";
import { useEffect, useState } from "react";
import { DEFAULT_LEAGUE_ID } from "../constant";
import { USER_SESSION_STORAGE_KEY } from "../lib/user-util";
import Player from "./Player";

const Players = ({league, day}: PlayersProps) => {
	const [userScores, setUserScores] = useState({} as Map<string, number>);

	useEffect(() => {
		async function fetchPlayers() {
			try {
				setUserScores(league.userScores);
			} catch (e) {
				sessionStorage.removeItem(USER_SESSION_STORAGE_KEY);
				window.location.href = "/";
			}
		}

		fetchPlayers();
	}, [league.userScores]);

	/*
	// to be used with day score sort if we want to
	function getDayScore(userId: string): number {
		return league.daysMap.get(day)?.userScores.get(userId)?.dayScore ?? 0;
	}
	*/

	function createPlayersElement(): JSX.Element {
		const scores = [] as { userId: string; score: number }[];
		try {
			userScores.forEach((score, userId) => {
				scores.push({ userId, score });
			});
		} catch (e) {
			// on refresh this runs before useEffect, how to initialize?
			console.log("userScores isn't initialized yet");
		}
		/*
		// sort by day score
		scores.sort(function (user1, user2) {
			return getDayScore(user1.userId) < getDayScore(user2.userId) ? 1 : -1;
		});
		*/
		scores.sort(function (user1, user2) {
			return user1.score < user2.score ? 1 : -1;
		});

		return <div className="player-window">{scores.map((m) => createPlayerElement(m.userId, m.score))}</div>;
	}

	function createPlayerElement(player: string, score: number): JSX.Element {
		return <Player player={player} day={day} score={score} league={league} />;
	}

	return createPlayersElement();
};

type PlayersProps = {
    league: League;
    day: number;
}

export default Players;
