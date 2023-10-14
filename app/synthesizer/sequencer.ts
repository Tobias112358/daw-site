const StartSequence = async (fm:any) => {
    if(fm) {
      fm.next_step();
      //doTimer(30000/fm.get_tempo(), 20, () => {}, () => {StartSequence(fm)});
      await new Promise(r => setTimeout(r, (30000/fm.get_tempo())));
      StartSequence(fm);
    }
  }

  const StopSequence = async (fm:any) => {
    if(fm) {
      fm.next_step();
      await new Promise(r => setTimeout(r, (30000/fm.get_tempo())));
      StartSequence(fm);
    }
  }

export {StartSequence, StopSequence};