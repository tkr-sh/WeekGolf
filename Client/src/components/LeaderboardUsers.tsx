import { A } from "@solidjs/router";
import { For, onMount } from "solid-js";
import "../style/LeaderboardUsers.scss";
import ordinal from "../utils/ordinal";
import userPfp from "../assets/imgs/nouser_white.jpg";
import formatNumber from "../utils/formatNumber";
import addRank from "../utils/addRankLeaderboard";


const LeaderboardUsers = (props: any) => {
    return <ul class="LeaderboardUsers">
        <For each={props.users} fallback={"No user for that category"}>
        {
            user =>
            <A href={"/profile?name=" + user.name}>
                <li>
                    {/* Rank of the user */}
                    <div class="rank">
                        {ordinal(user.rank)}
                    </div>

                    {/* Content of the profile picture */}
                    <div class="content-pfp">
                        <img src={user.pfp ?? userPfp}/>

                    </div>

                    {/* Name of the user */}
                    <h1>
                        {user.name}
                    </h1>

                    {/* Bytes */}
                    <div class="nb-bytes">
                        <span class="value">
                            {props.type === 'points' ? formatNumber(user.points) : user.bytes}
                        </span>
                        <span class="type">
                            {props.type}
                        </span>
                    </div>
                </li>
            </A>
        }
        </For>
    </ul>
}

export default LeaderboardUsers;