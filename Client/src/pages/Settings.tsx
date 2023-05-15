// Imports
//// Solid.JS
import { Component, createEffect, createSignal, For, onMount, Show, useContext } from 'solid-js';
//// Components
import Toggle from '../components/Toggle';
import SettingsTemplate from '../components/SettingsTemplate';
//// Style
import "../style/Settings.scss";
//// Utils
import "../utils/capitalize";
import capitalize from '../utils/capitalize';
import rgbToHsl from '../utils/rgbToHSL';
import layouts from '../utils/Layouts';
import changeTheme from '../utils/ChangeTheme';
import themeCorrespondance from "../data/themeCorrespondance.json";
//// Images
import palette from "../assets/icons/palette.svg";
import userPfp from "../assets/imgs/nouser_white.jpg";
import defaultBanner from "../assets/imgs/banner.jpg";
import uploadImg from "../assets/icons/img.svg";
import send from "../assets/icons/paper_plane.svg";
import cross from "../assets/icons/cross.svg";
import { DisplayMessageContext, DisplayMessageProviderType } from '../hooks/createDisplayMessage';








// Change color handle
const changeColor = (event: any): void => {
	const hex = event.target.value; // get hex
	const [r,g,b]=[hex.slice(1,3),hex.slice(3,5),hex.slice(5,7)].map(h => parseInt(h, 16)); // convert it to RGB

	changeTheme(Math.round(rgbToHsl(r,g,b).h * 360).toString()); // Change theme
}


// Change the layout configuration
const changeLayout = (layout: number) => {
	localStorage.setItem('layout', ""+layout);
	window.dispatchEvent(new Event("storage"));
}




// Personal data
const [personalData, setPersonalData] = createSignal<any | null>(null);

// Get different personal data
const get = async (data: string): Promise<string | object | undefined> => {
	// If the token is valid
	if (localStorage.getItem('token') === null || (localStorage.getItem("token") as string).length < 16) {
		return undefined;
	}

	// Define the optinos of the request
	const requestOptions: object = {
		method: 'GET',
		headers: {Authorization: `Basic ${localStorage.getItem("token")}`},
	};
	let rep: Response | undefined, json: any;

	// If we don't have yet the personal data
	if (personalData() === null) {
		rep = await fetch(`http://localhost:5000/api/v1/profile`, requestOptions)
		.catch(err => {console.error(err); return undefined;});
		json = await rep?.json();
		setPersonalData(json);
	}


	// Switch over the data type
	switch (data) {
		// Get the default profile picture
		case "pfp":
			return personalData().pfp ?? userPfp;

		// Get the default banner
		case "banner":
			return personalData().banner ?? defaultBanner;

		// Get the default country
		case "country":
			return personalData().country ?? "xx";

		// Get the default bio
		case "bio":
			return personalData().bio ?? "";

		// Get the default email 
		case "email":
			return personalData().email ?? "No e-mail";

		// Get the default email 
		case "name":
			return personalData().username ?? "No name";

		// Get the discord information about your account 
		case "discord":
			rep = await fetch(`http://localhost:5000/api/v1/discord`, requestOptions);
			json = await rep.json();
			return json;

		// In case it's another thing (shouldn't happen)
		default: 
			return ""
	}
}



/**
 * Send the updated data to the back-end like country, email, username ...
 */
const updateInformations = (type: string, data: string) => {
	// If the token is invalid
	if (localStorage.getItem('token') === null || (localStorage.getItem('token') as string).length < 16) {
		return;
	}

	// Define the content that needs to be send
	const requestOptions: object = {
		method: 'POST',
		headers: {Authorization: `Basic ${localStorage.getItem('token')}`}
	}
			
	fetch(`http://localhost:5000/api/v1/info?type=${type}&data=${data}`, requestOptions);
}



/**
 * 	The function that handle the submitting of a form
 * 
 * @param {string} type The type of submitting
 */
const handleSubmit = (type: string) => {

	// Depending on the type of submit, we do different things
	switch (type) {
		case "pfp":
		case "banner":
			// Put everything in a constant
			const rawImageData = type === "pfp" ? rawPfp() : rawBanner();

			// If it's null (shouldn't happen)
			if (rawImageData === null || !("name" in rawImageData)) {
				return;
			}

			// Create the formData to add 
			const formData = new FormData();
			formData.append('image', rawImageData, (rawImageData as any).name); // Add the image
			formData.append('type', type); // Add the type of data to send
	
			// Send the data to the server.
			const response = fetch('http://localhost:5000/api/v1/upload-image', {
				method: 'POST',
				body: formData,
				headers: {Authorization: `Basic ${localStorage.getItem('token')}`},
			} as object)
			.then(rep => {
				// If there is an error
				if (rep.status >= 400) {
					if (rep.status === 413) {
						setOnError("Your image is too big (Above 1MB)");
					}
					// Handle error...
				}
			})
			.catch(() => {
				setOnError('Your image is too big (Above 1MB)');
				console.error('Your image is too big (Above 1MB)');
			});
			break;
		

		case "bio":
			updateInformations("bio", bio());
			break;

		case "email":
			updateInformations("email", email());
			break;

		case "name":
			updateInformations("username", name());
			break;
		
		default:
			break;
	}
}





// Handle the change of PFP and banner
//// Profile picture
const handleChangePfp = (e: any) => {
	// Set the pfp for the preview
	setPfp(URL.createObjectURL(e.target.files[0]));
	setEmptyPfp(pfpInput?.files?.length === 0);
	// Set the raw profile picture that will be sent after
	setRawPfp(e.target.files[0]);
}

//// Banner
const handleChangeBanner = (e: any) => {
	// Set the banner for the preview
	setBanner(URL.createObjectURL(e.target.files[0]));
	setEmptyBanner(bannerInput?.files?.length === 0);
	// Set the raw banner that will be sent after
	setRawBanner(e.target.files[0]);
}

//// Get the current country
const handleChangeCountry = async () => {

	// If the current country is undefined
	if (country() === "xx") {
		getCountry()

		setTimeout(() => {
			updateInformations('country', country())
		}, 500);
	} else {
		setCountry("xx");
		updateInformations("country", "xx");
	}
}
//// Get the country of a user
const getCountry = async () => {
	fetch("https://ipapi.co/json/")
	.then(rep =>  rep.json())
	.then(rep => setCountry(rep.country.toLowerCase()));
}

const handleDiscordDisplay = async () => {
	// Update the discord display in the front end
	setDiscord(
		p => {
			p.disord_display = !p.discord_display;

			return p;
		}
	)

	// Update it in the back-end by sending a request
	fetch('http://localhost:5000/api/v1/discord-display', {
		method: 'PUT',
		headers: {Authorization: `Basic ${localStorage.getItem('token')}`},
	} as object)
	.catch(() => {
		setOnError('An error occured while trying to update the display of your discord account');
		console.error('An error occured while trying to update the display of your discord account');
	});
}






/**
 *==========================* JSON SETTINGS PART 
 */
// Hooks
//// Profile picture
const [pfp, setPfp] = createSignal<string>(await get('pfp') as string ?? userPfp);
const [rawPfp, setRawPfp] = createSignal(null);
const [emptyPfp, setEmptyPfp] = createSignal<boolean>(true);
//// Banner
const [banner, setBanner] = createSignal<string>(await get('banner') as string ?? defaultBanner);
const [rawBanner, setRawBanner] = createSignal(null);
const [emptyBanner, setEmptyBanner] = createSignal<boolean>(true);
//// Country
const [country, setCountry] = createSignal<string>(await get('country') as string ?? "xx");
//// Bio, Email, Username, ...
const [bio, setBio] = createSignal<string>(await get('bio') as string ?? '');
const [email, setEmail] = createSignal<string>(await get('email') as string ?? '');
const [name, setName] = createSignal<string>(await get('name') as string ?? '');
//// Get discord info
const [discord, setDiscord] = createSignal<any>(await get('discord') as object ?? {});
////
const [onError, setOnError] = createSignal<string | null>(null);
const [problemsInRow, setProblemsInRow] = createSignal<number>(+(localStorage.getItem("problemsInRow") ?? '1'));
let pfpInput: HTMLInputElement | undefined;
let bannerInput: HTMLInputElement | undefined;




/**
 * A json that corresponds to each category and section in settings
 */
const settingsJSON: any = {
	"appearance": [
		{
			title: "Layout",
			JSX: <form class="list-layout">
				<For each={[...Array(5).keys()]} fallback={"EROR"}>
					{
						n => <label>
							{layouts[n]}
							<input type="radio" name="radio" onChange={() => changeLayout(n)}/>
						</label>
					}
				</For>
			</form>
		},
		{
			title: "Theme",
			JSX: <div>
				Pick a custom color for your theme:
				<label>
					<div class='color-selector'>
						<img src={palette}/>
					</div>
					<input
						type="color"
						name="color-picker"
						value="#33CC33"
						onChange={changeColor}
						ref={pfpInput}
					/>
				</label>
			</div>
		},
		{
			title: "Dark mode",
			JSX: <div>Dark mode:
				<div style={{display: "block"}}>
					<Toggle
						default={(localStorage.getItem("mode") ?? 'dark') === "dark"}
						on={() => {localStorage.setItem("mode", "dark"); changeTheme(localStorage.getItem("color-theme") ?? "120")} }
						off={() => {localStorage.setItem("mode", "light"); changeTheme(localStorage.getItem("color-theme") ?? "120")}}
					/>
				</div>
			</div>
		},
		{
			title: "Activity format",
			JSX: <div>Would you like the activities to be in a row:
				<div style={{display: "block"}}>
					<Toggle
						default={localStorage.getItem("activityRow") == "true"}
						on={() => localStorage.setItem("activityRow", "true")}
						off={() => localStorage.setItem("activityRow", "false")}
					/>
				</div>
			</div>
		},
		{
			title: "Problems by row",
			JSX: <div>How many problems do you want to have every row in the page that <a href="/problems">list problems</a>:
				<div style={{display: "block"}}>
					<input
						type="range"
						name="problemsInRow"
						min="1"
						max="10"
						value={localStorage.getItem("problemsInRow") ?? "1"}
						onchange={(e) => {
							setProblemsInRow(+e?.currentTarget?.value);
							localStorage.setItem("problemsInRow", ""+problemsInRow());
						}}
					/>
					<div>
					{
						problemsInRow()
					}
					</div>
				</div>
			</div>
		},
		{
			title: "Partitioned leaderboard",
			JSX: <div>Would you like the leaderboard to be partitionned in multiple parts:
				<div style={{display: "block"}}>
					<Toggle
						default={localStorage.getItem("splitLeaderboard") == "true"}
						on={() => localStorage.setItem("splitLeaderboard", "true")}
						off={() => localStorage.setItem("splitLeaderboard", "false")}
					/>
				</div>
			</div>
		},
		{
			title: "Opaque problem",
			JSX: <div>Do you want the text in the problem to be totally opaque:
				<div style={{display: "block"}}>
					<Toggle
						default={localStorage.getItem("opaqueProblem") == "true"}
						on={() => localStorage.setItem("opaqueProblem", "true")}
						off={() => localStorage.setItem("opaqueProblem", "false")}
					/>
				</div>
			</div>
		},
	],
	"Account": [
		// Profile picture of user
		{
			title: "Profile picture",
			JSX:
			<form
				onSubmit={e => {
					e.preventDefault();
					handleSubmit("pfp");
					return false;
				}}
			>
				<label class="content-pfp">
					<img
						src={pfp()}
						class="pfp"
					/>

					<input
						type="file"
						name="avatar"
       					accept="image/png, image/jpeg"
						onChange={handleChangePfp}
						ref={pfpInput}
					/>

					<img src={uploadImg} class="upload-img"/>
				</label>
				<Show when={!emptyPfp()}>
					<button
						type='submit'
						// type="button"
						// onclick={() => handleSubmit('pfp')}
					>
						<img src={send}/>
					</button>
					<button
						onClick={async () => {
							if (pfpInput !== null && pfpInput !== undefined)
								pfpInput.files = null;
							
							setEmptyPfp(true);
							setPfp(await get('pfp') as string ?? "");
						}}
					>
						<img src={cross}/>
					</button>
				</Show>
				Change of profile picture by clicking on your current one
			</form>
		},

		// Banner of user
		{
			title: "Banner",
			JSX:
			<form
				onSubmit={e => {
					e.preventDefault();
					handleSubmit("banner");
					return false;
				}}
			>
				<label class="content-banner">
					<img
						src={banner()}
						class="banner"
					/>

					<input
						type="file"
						name="avatar"
						accept="image/png, image/jpeg"
						onChange={handleChangeBanner}
						ref={bannerInput}
					/>

					<img src={uploadImg} class="upload-img"/>
				</label>
				<Show when={!emptyBanner()}>
					<button
						type='submit'
					>
						<img src={send}/>
					</button>
					<button
						onClick={async () => {
							if (bannerInput !== null && bannerInput !== undefined)
								bannerInput.files = null;
							
							setEmptyBanner(true);
							setBanner(await get('banner') as string ?? "");
						}}
					>
						<img src={cross}/>
					</button>
				</Show>
				Change of Banner clicking on the current one
			</form>
		},

		// Bio description for users
		{
			title: "Bio",
			JSX:
			<form
				onSubmit={e => {
					e.preventDefault();
					handleSubmit("bio")
					return false;
				}}
			>
				<textarea
					value={bio()}
					onChange={(e) => setBio(e.currentTarget.value)}
				/>
				<button
					type='submit'
				>
					<img src={send}/>
				</button>
				<button
					onClick={async () => {
						setBio(await get('banner') as string ?? "");
					}}
				>
					<img src={cross}/>
				</button>
			</form>
		},

		// E-mail address
		{
			title: "E-mail",
			JSX:
			<form
				onSubmit={e => {
					e.preventDefault();
					handleSubmit("email")
					return false;
				}}
			>
				<input
					type="email"
					value={email()}
					onChange={(e) => setEmail(e.currentTarget.value)}
				/>
				<button type='submit'>
					<img src={send}/>
				</button>
				<button
					onClick={async () => {
						setEmail(await get('email') as string ?? "");
					}}
				>
					<img src={cross}/>
				</button>
			</form>
		},
		{
			title: "Username",
			JSX:
			<form
				onSubmit={e => {
					e.preventDefault();
					handleSubmit("name")
					return false;
				}}
			>
				<input
					type="name"
					value={name()}
					onChange={(e) => setName(e.currentTarget.value)}
				/>
				<button type='submit'>
					<img src={send}/>
				</button>
				<button
					onClick={async () => {
						setName(await get('name') as string ?? "");
					}}
				>
					<img src={cross}/>
				</button>
			</form>
		},
		{
			title: "Discord",
			JSX: <section>
				Do you want your discord name to be public ?<br/>
				<Toggle
					default={discord()?.discord_display}
					on={handleDiscordDisplay}
					off={handleDiscordDisplay}
				/><br/><br/>

				Manage your discord account:<br/>
				<button class='discord'>
					<a
						href={`http://localhost:5000/auth/discord-init-link?token=${localStorage.getItem('token')}`}
					>
						{discord().discord ?? "No discord"}
					</a>
				</button>
			</section>
		},
		{
			title: "Country",
			JSX: <div>
				Do you want your country to be public ?
				<img
					src={`src/assets/icons/flags/${country().toLowerCase()}.svg`}
					class="country"
				/>
				<Toggle
					default={country() !== 'xx'}
					on={handleChangeCountry}
					off={handleChangeCountry}
				/>
			</div>
		}
	],
	"Quit": [
		{
			title: "Disconnect",
			JSX: <button class="quit" onclick={() => {localStorage.removeItem('token');document.location.href = 'http://localhost:3000'}}>

				<span>DISCONNECT</span>
			</button>
		}
	],
}


















/**
 * Component Settings
 * 
 * @returns the component
 */
const Settings: Component = () => {

	const [bigClass, setBigClass] = createSignal("")
	let test: HTMLDivElement | undefined;
	let jsonRef: { [key: string]: HTMLDivElement } = {};
	const { handleError } = useContext(DisplayMessageContext) as DisplayMessageProviderType;

	// When Mounted
	onMount(() => {
		window.addEventListener('resize', handleResize);

		handleResize();
	});

	// When there is an error
	createEffect(() => {
		console.log("Error");
		if (onError() !== null) {
			handleError(onError() ?? '');
			setOnError(null);
		}
	})

	// Handle the resize
	const handleResize = () => {
		if (window.innerWidth > 1000) {
			setBigClass("big");
		} else {
			setBigClass("");
		}
	}

	createEffect(() => console.log(jsonRef));

	return (
        <div class={'Settings ' + bigClass()}>
            <nav>
				<For each={Object.keys(settingsJSON)} fallback={<section>Loading...</section>}>
					{
						category => <>
							<button
								onClick={() => jsonRef[category]?.scrollIntoView()}
								class="category"
							>
								{capitalize(category)}
							</button>

							<For
								each={settingsJSON[category]}
								fallback={<section>Loading...</section>}
							>
								{
									section => <button onClick={() => jsonRef[section.title]?.scrollIntoView()}>
										{capitalize(section.title)}
									</button>
								}
							</For>
						</>
					}
				</For>
            </nav>
            <main>	
				{
					<For each={Object.keys(settingsJSON)} fallback={<section>Loading...</section>}>
						{category => <section>

							<div class="title-category" ref={el => jsonRef[category] = el}>{capitalize(category)}</div>
							<div class='line-category'/>

							<For each={settingsJSON[category]} fallback={<section>Loading...</section>}>
								{
									section => <SettingsTemplate
										forwardRef={jsonRef}
										title={section.title}
										JSX={section.JSX}
									/>
								}
							</For>
						</section>}
					</For>
				}
            </main>
        </div>
	);
}



export default Settings;