import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import CompletedCard from "./Completed";
import UpcomingCard from "./Upcoming";
import Bottom from "../../screens/Bottom";

const Tab = createMaterialTopTabNavigator();

function AppointmentTab() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Upcomimg" component={UpcomingCard} />
      <Tab.Screen name="Completed" component={CompletedCard} />
    </Tab.Navigator>
  );
}
export default AppointmentTab;
