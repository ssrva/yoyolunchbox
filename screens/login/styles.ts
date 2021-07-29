import { StyleSheet } from 'react-native';
import { primaryColor } from "../../commonUtils"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: primaryColor,
  },
  background: {
    flex: 1,
    padding: 30,
    paddingTop: 200,
    resizeMode: "cover",
  },
  input: {
    width: "100%",
    marginBottom: 30,
  },
  title: {
    fontSize: 35,
    textAlign: "center",
    fontWeight: "900",
    marginBottom: 30,
    color: "white",
  },
  button: {
    alignItems: "center",
    backgroundColor: primaryColor,
    padding: 5,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 30,
  },
  link: {
    color: "lightblue",
    textDecorationLine: "underline",
    textAlign: "center",
  }
});

export default styles;
