import React, { useEffect, useState } from "react";
import { Sequencer } from "./Sequencer";

const width = 12;
const height = 12;

const sequencer = new Sequencer();

const padActiveStyle = "dark:bg-green-600 hover:bg-green-400";

const Drumbox = () => {
  const [mouseDown, setMouseDown] = useState<boolean>(false);
  const [hoverMode, setHoverMode] = useState<string>("add");
  const [activePads, setActivePads] = useState<string[]>([]);
  const [sequenceMap, setSequenceMap] = useState<Array<boolean[]>>(
    Array(height).fill(Array(width).fill(false))
  );

  useEffect(() => {
    sequencer.updateSequenceMap(sequenceMap);
  }, [sequenceMap]);

  useEffect(() => {
//    sequencer.beatsObservable$.subscribe();
  }, [])

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    const [padId, padIndex] = getPadDataFromEvent(e);

    setActivePads((activePads) =>
      padIndex != -1
        ? [...activePads].filter((id) => id != padId)
        : [...activePads, padId]
    );

    setSequenceMap((sequenceMap) => {
      const [row, col] = getPadPositionFromId(padId);
      const newSequence = sequenceMap.map((row) => [...row]);
      newSequence[row][col] = padIndex != -1 ? false : true;
      return newSequence;
    });

    setHoverMode(padIndex != -1 ? "remove" : "add");
    setMouseDown(true);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    setMouseDown(false);
  };

  const handleMouseOver = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!mouseDown) {
      return;
    }

    const [padId, padIndex] = getPadDataFromEvent(e);
    const [row, col] = getPadPositionFromId(padId);

    if (hoverMode === "add" && padIndex == -1) {
      setActivePads((activePads) => [...activePads, padId]);
      setSequenceMap((prevSequenceMap) => {
        const newSequence = prevSequenceMap.map((row) => [...row]);
        newSequence[row][col] = true;
        return newSequence;
      });
    }

    if (hoverMode === "remove" && padIndex != -1) {
      setActivePads((activePads) =>
        [...activePads].filter((id) => id != padId)
      );

      setSequenceMap((sequenceMap) => {
        const newSequence = sequenceMap.map((row) => [...row]);
        newSequence[row][col] = false;
        return newSequence;
      });
    }
  };

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

  const setPadStyles = (padId: string) => {
    const isPadActive = activePads.indexOf(padId) != -1;

    const mainStyles =
      "w-14 h-14 m-2 bg-black dark:bg-slate-600 hover:bg-slate-400";
    const activeStyles = "dark:bg-green-800 hover:bg-green-600";

    return isPadActive ? [mainStyles, activeStyles].join(" ") : mainStyles;
  };

  const Pad = (index: number) => (
    <button
      className={setPadStyles(`pad-${index}`)}
      onMouseOver={handleMouseOver}
      onMouseDown={handleMouseDown}
      id={`pad-${index}`}
    ></button>
  );
  return (
    <>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          console.log("STARTING SEQ");
          sequencer.start();
        }}
      >
        START
      </button>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          console.log("STOP SEQ");
          sequencer.stop();
        }}
      >
        STOP
      </button>
      <div
        className="drumbox"
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
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
    </>
  );
};

export default Drumbox;
