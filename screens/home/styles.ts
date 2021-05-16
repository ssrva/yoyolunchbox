import { StyleSheet } from "react-native"
import { primaryColor, primaryBackgroundColor, COLORS } from "../../commonUtils"

const styles = StyleSheet.create({
  headerContainer: {
    padding: "1rem",
    borderBottomWidth: 2,
    borderBottomColor: primaryColor,
    marginBottom: "1rem"
  },
  mainViewStyle: {
    backgroundColor: primaryBackgroundColor,
    flex: 1,
  },
  innerContainer: {
    margin: "1rem",
    padding: "1rem",
  },
  input: {
    width: "100%",
    padding: "0.5rem",
    borderColor: COLORS.GRAY70,
    borderWidth: 1,
    borderRadius: "0.2rem",
    marginBottom: "2rem",
  },
  title: {
    fontSize: "1.8rem",
    textAlign: "center",
    fontWeight: "600",
    marginTop: "3rem",
    marginBottom: "5rem",
  },
  login: {
    flex: 1,
    alignItems: "center",
  }
})

export default styles
