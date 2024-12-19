import React, {useState, useEffect} from "react";
import { View, ScrollView } from "react-native";
import LocalAPI from "./pages/LocalAPI";

const App = () => {
  const [isShow, SetIsShow] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      SetIsShow(false);
    }, 6000)
  }, []);
  return (
    <View>
      <ScrollView>
        <LocalAPI />
      </ScrollView>
    </View>
  )
}

export default App;