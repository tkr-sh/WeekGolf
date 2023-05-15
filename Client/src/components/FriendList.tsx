import { A } from "@solidjs/router";
import { For, createEffect, createSignal, onMount } from "solid-js";
import defaultPfp from "../assets/imgs/nouser_white.jpg"


//// The data of a user for friends
interface friendDataType {
    username: string,
    pfp: string,
}
//// The object that contains all friends
interface friendObjectType {
    followers: friendDataType[],
    following: friendDataType[],
    friends: friendDataType[],
}



const FriendList = ({id, name}: {[key: string]: string}) => {
    const [friends, setFriends] = createSignal<friendObjectType>();
    const [selected, setSelected] = createSignal<keyof friendObjectType>('friends' as keyof friendObjectType);
    
    // Get the friends of the user
    const getFriends = () => {
        fetch(`http://localhost:5000/api/v1/friends?name=${name}&id=${id}`)
        .then(rep => rep.json())
        .then(rep => {
            setFriends(
                {
                    friends: rep.followers.filter((f: friendDataType) => rep.following.map((u:any)=>u.username).includes(f.username)),
                    following: rep.following.filter((f: friendDataType) => !rep.followers.map((u:any)=>u.username).includes(f.username)),
                    followers: rep.followers.filter((f: friendDataType) => !rep.following.map((u:any)=>u.username).includes(f.username)),
                }
            )
        });
    }

    // When the component is mounted, fetch
    onMount(() => {
        if (id !== undefined || name !== undefined) {
            getFriends();
        }
    });

    // When the parameters changes
    createEffect(() => {
        console.log(id, name)

        if (id !== undefined || name !== undefined) {
            getFriends();
        }
    });

    return <main class="friend">
        <header>
            <button onClick={() => setSelected("followers")}>
                <h2>Follower{friends()?.followers.length !== 1 ? "s" : ''}</h2> - ({friends()?.followers.length})
            </button>
            <button onClick={() => setSelected("friends")}>
                <h2>Friend{friends()?.friends.length !== 1 ? "s" : ''}</h2> - ({friends()?.friends.length})
            </button>
            <button onClick={() => setSelected("following")}>
                <h2>Following{friends()?.following.length !== 1 ? "s" : ''}</h2> - ({friends()?.following.length})
            </button>
        </header>

        <main>
            <For each={(friends() ?? {friends: [], followers: [], following: []})[selected()]} fallback={`No ${selected()}`}>
            {
                f => <a href={`/profile?name=${f.username}`}>
                    <div class="content-pfp">
                        <img src={f.pfp ?? defaultPfp}/>
                    </div>
                    {f.username}
                </a>
            }
            </For>
        </main>
    </main>
}


export default FriendList;