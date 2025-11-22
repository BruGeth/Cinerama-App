import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBEFE1',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#A91B3C',
    textAlign: 'center',
  },
  sedesContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
    paddingLeft: 4,
    marginTop: 12,
  },
  mapContainer: {
    marginTop: 12,
    backgroundColor: '#fff',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  map: { 
    width: "100%", 
    height: 300, 
    borderRadius: 8, 
    overflow: "hidden",
    
  },
  mapButton: {
    backgroundColor: '#A91B3C',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 25,
    alignSelf: 'center',
    marginTop: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  cardImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#f0f0f0',
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#A91B3C',
  },
  cardAddr: {
    fontSize: 14,
    color: '#666',
    marginTop: 6,
  },
  cardDistance: {
    fontSize: 14,
    color: '#ff5a5f',
    marginTop: 8,
  },
  cardButton: {
    backgroundColor: '#A91B3C',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 25,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  cardButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  block: { 
    backgroundColor: '#fff',
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    width: "100%", 
    alignItems: "center",
    padding: 8,
  },
  name: { 
    fontSize: 20, 
    fontWeight: "700" 
  },
  address: { 
    fontSize: 14, 
    color: "#444", 
    marginTop: 6 
  },
  distance: { 
    fontSize: 16, 
    color: "#ff5a5f", 
    marginTop: 8 
  },
  error: { 
    color: "#b00020", 
    marginBottom: 12, 
    textAlign: "center" 
  },
});

export default styles;
