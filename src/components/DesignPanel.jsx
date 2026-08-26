import CanvasSettings from './CanvasSettings';
import LayerList from './LayerList';
import PropertiesPanel from './PropertiesPanel';
import ContactCard from './ContactCard';

// The right-hand column on a wide screen; the "Design" drawer on a narrow one.
// The contact card rides along in both, since a narrow screen has no footer to
// put it in.
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
