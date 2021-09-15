//input koji djelomično radi
//probala si picker unutar on change, sve stavit u jedan originalni state, sve stavit u novi state. If else dok je bilo undefined, taj problem jeiješen s trenutnim value const

export default function Input(props) {
  const [state, setState] = useState({ text: "" });
  const [emoji, setEmoji] = useState({ emoji: "" });
  const [input, setInput] = useState(null);

  /* var Filter = require("bad-words"),
  filter = new Filter(); */

  const picker = new EmojiButton();
  picker.on("emoji", (selection) => {
    setEmoji({ emoji: selection.emoji });
  });

  const onClick = () => {
    picker.togglePicker();
  };
  const onChange = (event) => {
    setState({ text: event.target.value });
  };
  //if else ne radi
  const value = emoji.emoji + state.text;
  const onSubmit = (event) => {
    event.preventDefault();
    setState({ text: "" });
    setEmoji({ emoji: "" });
    props.onSendMessage(value);
  };

  return (
    <div className="Input">
      <form onSubmit={(event) => onSubmit(event)}>
        <input
          onChange={(event) => onChange(event)}
          value={value}
          type="text"
          placeholder="Enter your message and press ENTER"
          autoFocus={true}
          className="mx-3"
        />
        <Button onClick={(event) => onClick(event)} type="button">
          Emoji
        </Button>
        <Button className=" rounded-pill" type="submit">
          Send
        </Button>
      </form>
    </div>
  );
}
