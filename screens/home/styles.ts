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
    paddingTop: 20,
    flex: 1,
  },
  innerContainer: {
    margin: "1rem",
    padding: "1rem",
  },
  input: {
    width: "100%",
    padding: 5,
    borderColor: COLORS.GRAY70,
    borderWidth: 1,
    borderRadius: 2,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "600",
    marginTop: 30,
    marginBottom: 50,
  },
  login: {
    flex: 1,
    alignItems: "center",
  },
  ordersPageMainView: {
    flex: 1,
  },
  ordersContainer: {
    flex: 1,
    marginTop: 20,
    display: "flex",
  },
  sectionHeader: {
    fontWeight: "600",
    fontSize: 18,
    margin: 20,
    marginBottom: 0,
    padding: 10,
    marginTop: 0,
    backgroundColor: COLORS.GRAY95,
    borderRadius: 5,
  },
  button: {
    alignItems: "center",
    backgroundColor: COLORS.GRAY95,
    marginLeft: 20,
    marginRight: 20,
    padding: 5,
    borderRadius: 5,
  },
  dateContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    margin: 20,
  },
  confirmButton: {
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
    shadowColor: COLORS.GRAY60,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3.0,
    elevation: 1,
    textTransform: "uppercase",
    textAlign: "center",
    backgroundColor: "green",
    borderRadius: 4,
  },
  confirmOrderText: {
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  mainButton: {
    backgroundColor: primaryColor,
    borderColor: primaryColor,
  }
})

export default styles
