import { For, createSignal, onMount } from "solid-js";
import "../style/Status.scss";
import formatLang from "../data/formatLang.json";


const formatMs = (time: number) => time === -1 ? "DOWN" : time > 1000 ? `${(time / 1000).toFixed(3)}s` : `${Math.round(time)}ms`;
const getHue = (time: number) =>
  Math.max(
    0,
    Math.round(
      200 + (-(Math.pow(Math.log10(time * 60 + 5e-4 ), 3)))
    )
  ) +
  Math.max(
    0,
    Math.round((1000 - time) / 50)
  );

const Status = () => {

  const [status, setStatus] = createSignal<{[key: string]: number}>({});

  onMount(() => {
    fetch("https://api.weekgolf.net/api/v1/status")
    .then(rep => rep.json())
    .then(rep => setStatus(rep));
  });



  return <table class="Status">
    <tbody>
      <For each={Object.keys(status()).filter(l => l !== "node")}>
      {
        l => {
          const ms = status()[l]

          return <tr>
            <td>
            {
              (formatLang as {[key: string]: string})[
                l
              ]
            }
            </td>
            <td
              style={{
                "background-color": `hsl(${getHue(ms < 0 ? 60_000 : ms)}, 100%, ${ms < 0 ? 25 : Math.round(Math.max(30, 50 - ms / 1000))}%)`
              }}
            >
              <b>{formatMs(status()[l])}</b>
            </td>
          </tr>
        }
      }
      </For>
    </tbody>
  </table>
}


export default Status;
