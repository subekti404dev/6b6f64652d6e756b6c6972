import "twin.macro";
import { useTheme } from "next-themes";
import { useCrot } from "../hooks/useCrot";
import { useEffect } from "react";
import { BallTriangle } from "react-loader-spinner";

const Index = () => {
  const { setTheme } = useTheme();
  useEffect(() => {
    setTheme("dark");
  });
  const { url, getRandomLink, key, loading } = useCrot();
  return (
    <>

      <div tw="flex flex-col justify-center items-center h-full w-full pt-10">
        {!loading && (
          <div tw="width[23rem] justify-center items-center">
            {url && <div tw="background-color[#3a3a3a] m-4 p-4 pr-0 border-radius[0.5rem] word-wrap[break-word]">
              <div tw="flex flex-row">
                <div tw="width[90%]">{url}</div>
                <button
                  tw="flex justify-center items-center"
                  onClick={async () => {
                    await navigator.clipboard.writeText(url);
                    alert("copied");
                  }}
                >
                  <img src="copy.png" tw="width[18px]" />
                </button>
              </div>
            </div>}
            {url && key && <div tw="text-center background-color[#3a3a3a] m-4 p-1 border-radius[0.5rem] word-wrap[break-word]">
              {key}
            </div>}
            <div tw="text-center cursor[pointer] m-4 p-2 border[1px solid yellow] color[yellow] border-radius[0.5rem] text-lg font-semibold" onClick={getRandomLink}>Random</div>
            <div tw="text-center text-xs mt-8">How to Decrypt:</div>
            <div tw="text-center text-xs">Tanya Mang Wahyu 😂</div>
          </div>
        )}
        {loading && (
          <BallTriangle
            height={100}
            width={100}
            radius={5}
            color="#4fa94d"
            ariaLabel="ball-triangle-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        )}
      </div>
    </>
  );
};

export default Index;
