import Reactor from "../Reactor";
import {dataSource} from "../data/dataService";
import {AsyncStorage} from "react-native";

const defaultPolutionValue = "pm10";

class PolutionService extends Reactor{

  setPolution(pt){
      dataSource.updateState({polutionType: pt});
      AsyncStorage.setItem("polutionType", pt);
      this.dispatchEvent("changePolution");
  }
  getCurrentPolution(){
    let dataValue = dataSource.getState().polutionType;
    return dataValue? dataValue : defaultPolutionValue;
  }
  async initPolutionService(){
    let polutionType = await  AsyncStorage.getItem("polutionType");
    if(!polutionType)
      polutionType = defaultPolutionValue;
    dataSource.updateState({polutionType:polutionType});
  }
}

let polutionService = new PolutionService();
export {polutionService}