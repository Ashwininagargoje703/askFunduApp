import * as React from "react";
import { Modal, Portal, Text, Button, PaperProvider } from "react-native-paper";
import VerticalTabs from ".";

const FilterButton = ({
  checkedValues,
  setCheckedValues,
  languages,
  selectLanguages,
  // applyFilters,
  checkedAreaFocusValues,
  setCheckedAreaFocusValues,
  areaOfFocus,
  setAreaOfFocus,
  selectedRating,
  setSelectedRating,
  isSebiRegistered,
  setIsSebiRegistered,
  isCertified,
  setIsCertified,
}) => {
  const [visible, setVisible] = React.useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = { backgroundColor: "white", padding: 20 };

  return (
    <PaperProvider>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={containerStyle}
        >
          <Text>Apply Filters</Text>
        </Modal>
      </Portal>
      <Button style={{ marginTop: 30 }} onPress={showModal}>
        <VerticalTabs
          checkedValues={checkedValues}
          setCheckedValues={setCheckedValues}
          languages={languages}
          selectLanguages={selectLanguages}
          checkedAreaFocusValues={checkedAreaFocusValues}
          setCheckedAreaFocusValues={setCheckedAreaFocusValues}
          areaOfFocus={areaOfFocus}
          setAreaOfFocus={setAreaOfFocus}
          selectedRating={selectedRating}
          setSelectedRating={setSelectedRating}
          isSebiRegistered={isSebiRegistered}
          setIsSebiRegistered={setIsSebiRegistered}
          isCertified={isCertified}
          setIsCertified={setIsCertified}
        />
      </Button>
    </PaperProvider>
  );
};

export default FilterButton;
