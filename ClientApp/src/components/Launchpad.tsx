import { useState } from "react";
import "./Launchpad.css";

const Launchpad = ({ width = 9, height = 9 }) => {
  const [activePads, setActivePads] = useState<string[]>([]);
  const padActiveStyle = "dark:bg-green-600 hover:bg-green-400";

  const setPadStyles = (padId: string) => {
    const isPadActive = activePads.indexOf(padId) != -1;

    const mainStyles =
      "relative w-16 h-16 m-1.5 bg-slate-400";
    const activeStyles = "dark:bg-orange-600 active pad-shadow";

    return isPadActive ? [mainStyles, activeStyles].join(" ") : mainStyles;
  };



  const Pad = (index: number) => (
    <button onClick={handleMouseClick} className={setPadStyles(`pad-${index}`)} id={`pad-${index}`}>
    </button>
  );


  const handleMouseClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const [padId, padIndex] = getPadDataFromEvent(e);
    const [row, col] = getPadPositionFromId(padId);
    setActivePads((activePads) => padIndex != -1 ? [...activePads.filter(id => id != padId)] : [ ...activePads, padId ]);
  }



  const getPadDataFromEvent = (
    e: React.MouseEvent<HTMLElement>
  ): [string, number] => [
    e.currentTarget.id,
    activePads.indexOf(e.currentTarget.id),
  ];


  const getPadPositionFromId = (padId: string): [number, number] => {
    const row = Math.floor((parseInt(padId.slice(4)) - 1) / height);
    const col = (parseInt(padId.slice(4)) - 1) % height;

    return [row, col];
  };

  return (
    <div className="launchpad w-max h-max p-7 bg-black">
      {[...Array(height)].map((row, rowIndex) => {
        return (
          <div className="flex">
            {[...Array(width)].map((col, colIndex) =>
              Pad(rowIndex * width + colIndex + 1)
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Launchpad;
