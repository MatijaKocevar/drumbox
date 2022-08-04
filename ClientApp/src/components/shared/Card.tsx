import React from "react";

export const Card = ({ children, className }: { children: React.ReactNode, className: string }) => {
  return <div className={ `${className} mx-auto p-3 min-w-l rounded-sm shadow-sm lg:max-w-7xl mt-3 bg-slate-700 text-white text-sm ` }>{children}</div>;
};
