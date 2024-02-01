import { useTheme } from "next-themes";
import tw from "twin.macro";
import { useCrot } from "../hooks/useCrot";
import { useEffect } from "react";

const Index = () => {
  const { setTheme } = useTheme();
  useEffect(() => {
    setTheme("dark");
  });
  const { url, getRandomLink, key } = useCrot();
  return (
    <>

      <div tw="flex flex-col justify-center items-center h-full w-full pt-10">
        <div tw="width[24rem] justify-center items-center">
          {url && <div tw="background-color[#3a3a3a] m-4 p-4 border-radius[0.5rem] word-wrap[break-word]">
            {url}
          </div>}
          {url && key && <div tw="text-center background-color[#3a3a3a] m-4 p-1 border-radius[0.5rem] word-wrap[break-word]">
            {key}
          </div>}
          <div tw="text-center cursor[pointer] m-4 p-2 border[1px solid yellow] color[yellow] border-radius[0.5rem] text-lg font-semibold" onClick={getRandomLink}>Random</div>

        </div>
      </div>
    </>
  );
};

export default Index;


const Button = tw.button`
  capitalize font-semibold text-2xl border-2 px-5 my-2 rounded border-blue-600 dark:border-blue-500
`;
