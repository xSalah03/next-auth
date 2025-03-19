const Spinner = () => {
  return (
    <span
      className="animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-blue-600 dark:text-blue-600 rounded-full"
      role="status"
      aria-label="loading"
    ></span>
  );
};

export default Spinner;
