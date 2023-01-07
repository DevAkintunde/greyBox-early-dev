const Notice = (props) => {
  const className = props.className;
  const notice = props.notice;

  return (
    <>
      <div
        className={
          "mx-auto min-h-min text-center text-lg" +
          (className ? " " + className : "")
        }
      >
        {notice ? notice : "Oops! We're working on this..."}
      </div>
    </>
  );
};
export default Notice;
