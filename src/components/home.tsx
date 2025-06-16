import { languages } from "../utils/constants";
import { Text } from "@create-figma-plugin/ui";
import CheckMarkIcon from "../assets/active-icon.svg";
import { CircleLoader } from "react-spinners";

const Home = ({
  onClick,
  loading,
  active,
  triggerGetTextOnFigma,
}: {
  onClick: (arg0: any) => void;
  loading: boolean;
  active: string;
  triggerGetTextOnFigma: () => void;
}) => {
  return (
    <div>
      <p className={"font-medium px-7 text-xs mt-[28px] mb-[16px] text-left"}>
        Select preferred language
      </p>

      {languages?.map(({ icon, name, value }) => {
        return (
					<div
						onClick={() => onClick(value)}
						className={"rounded-[16px] cursor-pointer bg-[#FAFAFA] mx-6"}
					>
						<div
							className={
								"flex justify-between px-[12px] mb-[8px] items-center"
							}
						>
							<div className={"flex justify-start items-center gap-[14px] "}>
								<div className={"w-6 h-6 my-[10px]"}>{icon}</div>
								<Text className={"cursor-pointer  text-[14px] font-medium"}>
									{name}
								</Text>
							</div>
							{active === value ? (
								<img className={"w-[14px] h-[14px]"} src={CheckMarkIcon} alt="#" />
							) : (
								<div
									className={
										"w-[14px] h-[14px] rounded-full border border-[#D7D6D5] border-dashed"
									}
								/>
							)}
						</div>
					</div>
				);
      })}
      <div className={"w-full px-7 "}>
        <button
          onClick={triggerGetTextOnFigma}
          disabled={!active}
          className={
            "focus:outline-none focus:ring-0 bg-[#100F0E] rounded-[20px] text-xs text-white  mt-[4px] w-full py-6 "
          }
        >
          {loading ? (
            <CircleLoader
              color={"white"}
              loading={loading}
              size={20}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          ) : (
            "Replace Original"
          )}
        </button>
      </div>
    </div>
  );
};

export default Home