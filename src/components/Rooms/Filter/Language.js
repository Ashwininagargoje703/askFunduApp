import { Checkbox } from "react-native-paper";
import React, { useState } from "react";
import { Text } from "react-native";

const LanguageFilter = ({}) => {
  const [checked, setChecked] = React.useState(false);
  const [showBox, setShowBox] = useState(false);

  return (
    <>
      <Text style={{ letterSpacing: 0.4 }}>Language</Text>

      <Checkbox
        status={checked ? "checked" : "unchecked"}
        onPress={() => {
          setChecked(!checked);
        }}
      />
    </>
  );
};

export default LanguageFilter;
