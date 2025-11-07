type ButtonProps = {
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
};

const Button = ({ count, setCount }: ButtonProps) => (
  <button onClick={() => setCount((count) => count + 1)}>
    count is {count - 5}
  </button>
);

export default Button;
