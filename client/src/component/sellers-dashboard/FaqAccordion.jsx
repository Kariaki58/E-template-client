

import React, { useEffect, useState } from 'react'
import Accordion from './Accordion'


const FaqAccordion = ({ faqItems, setFaqItems }) => {

  return (
    <Accordion faqItems={faqItems} setFaqItems={setFaqItems} />
  )
}

export default FaqAccordion