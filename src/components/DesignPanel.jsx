// The right-hand column on a wide screen; the "Design" drawer on a narrow one.
// Groups the three panels that act on the banner as a whole and the selected
// layer. The contact card rides along in both, since a narrow screen has no
// footer to put it in.

import CanvasSettings from './CanvasSettings';
import LayerList from './LayerList';
import PropertiesPanel from './PropertiesPanel';
import ContactCard from './ContactCard';

export default function DesignPanel() {
  return (
    <>
      <CanvasSettings />
      <LayerList />
      <PropertiesPanel />
      <div className="p-4 pt-0">
        <ContactCard />
      </div>
    </>
  );
}
