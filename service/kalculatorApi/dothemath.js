
const doTheMath = (obj, dimFrom, dimTo, wgtFrom, wgtTo) => {
    const originalRequest = obj.map((a) => ({ ...a }))
    let workableObject = obj.map((a) => ({ ...a }))
    let finalObj = {}
  
    let hasZeros = false
  
    workableObject.map((cz) => {
      if (cz.weight === 0) {
        hasZeros = true
      }
    })
  
    if (dimFrom === 'mm' || dimFrom === 'cm') {
      originalRequest.forEach((row, key) => {
        workableObject[key].dimL = convertToInches(row.dimL, dimFrom)
        workableObject[key].dimW = convertToInches(row.dimW, dimFrom)
        workableObject[key].dimH = convertToInches(row.dimH, dimFrom)
      })
    }
  
    if (wgtFrom === 'kg') {
      originalRequest.forEach((row, key) => {
        workableObject[key].weight = convertToPounds(row.weight)
      })
    }
  
    let longestPiece = 0
    let widestPiece = 0
    let tallestPiece = 0
    let heaviestPiece = 0
    let totalQuantity = 0
    let totalWeight = 0
    let sqArea = 0
    let cuArea = 0
    let spaceOnTruck = 0
  
    workableObject.map((item, key) => {
      let l = Number(item.dimL)
      let w = +item.dimW
      let h = +item.dimH
      let wgt = Number(item.weight)
      totalWeight = totalWeight + wgt
      totalQuantity = +item.quantity + totalQuantity
  
      let tmpDensity = 0
      let tmpCuArea = 0
      let tmpSqArea = 0
  
      tmpCuArea = (l * w * h * item.quantity) / 1728
      tmpSqArea = (+l / 12) * (+w / 12) * item.quantity
      workableObject[key].sqArea = tmpSqArea
      workableObject[key].cuArea = tmpCuArea
  
      cuArea = cuArea + tmpCuArea
      sqArea = sqArea + tmpSqArea
  
      if (hasZeros) {
        workableObject[key].calculatedClass = '~'
        workableObject[key].density = '~'
      } else {
        tmpDensity = wgt / tmpCuArea
        workableObject[key].density = tmpDensity
        workableObject[key].calculatedClass = calcClass(tmpDensity)
      }
  
      if (item.dimL > longestPiece) {
        longestPiece = item.dimL
      }
      if (item.dimW > widestPiece) {
        widestPiece = item.dimW
      }
      if (item.dimH > tallestPiece) {
        tallestPiece = item.dimH
      }
  
      if (item.weight / item.quantity > heaviestPiece) {
        heaviestPiece = item.weight / item.quantity
      }
    })
  
    if (hasZeros) {
      heaviestPiece = Math.ceil(totalWeight / totalQuantity)
    }
  
    let fullRowFeet = 0
    let balanceArray = []
  
    workableObject.map((pc, key) => {
      let tmpSOT = 0
      let rowCount = 0
      let maxPerRow = 0
      let tmpPcObj = { ...pc }
  
      maxPerRow = Math.floor(98 / pc.dimW)
      rowCount = Math.ceil(pc.quantity / maxPerRow)
  
      tmpSOT = (rowCount * pc.dimL) / 12
      let numFourFeet = pc.sqArea / 32.66666666667
      let sqMath = (Math.ceil(numFourFeet * 2) / 2).toFixed(1) * 4
  
      let theAnswerBe = 0
  
      if (maxPerRow == 1) {
        theAnswerBe = tmpSOT
      } else {
        theAnswerBe = sqMath
      }
      workableObject[key].spaceOnTruck = theAnswerBe
  
      if (maxPerRow * rowCount == pc.quantity) {
        tmpSOT = (rowCount * pc.dimL) / 12
        fullRowFeet = tmpSOT
      } else {
        let fullRowCount = rowCount - 1
        let fullQty = (rowCount - 1) * maxPerRow
        let balanceQty = pc.quantity - fullQty
        tmpSOT = (fullRowCount * pc.dimL) / 12
  
        tmpPcObj.quantity = balanceQty
        balanceArray.push(tmpPcObj)
  
        fullRowFeet = tmpSOT
      }
  
      spaceOnTruck = spaceOnTruck + fullRowFeet
    })
  
    let balanceLength = 0
    let longestLength = 0
    let balanceWidth = 0
  
    for (let r = 0; r < balanceArray.length; r++) {
      let tmpBalanceWidth = balanceArray[r].quantity * balanceArray[r].dimW
  
      if (+balanceArray[r].dimL > longestLength) {
        longestLength = +balanceArray[r].dimL
      }
  
      if (+balanceWidth + +tmpBalanceWidth < 99) {
        balanceWidth = +balanceWidth + +tmpBalanceWidth
      } else {
        spaceOnTruck = spaceOnTruck + longestLength / 12
        balanceLength = 0
        longestLength = 0
        balanceWidth = 0
      }
    }
  
    spaceOnTruck = spaceOnTruck + longestLength / 12
  
    let possibleEq = []
    let eqRes = []
    let reqPermit = false
  
    eqTypes.map((eq, key) => {
      let hasFailed = false
      let eqSq = (eq.maxLength / 12) * (eq.maxWidth / 12)
      let eqCu = (eq.maxLength * eq.maxWidth * eq.maxHeight) / 1728
      let numTrucks = 1
      reqPermit = false
  
      if (longestPiece > eq.maxLength) {
        if (!eq.canExLength) {
          hasFailed = true
        } else {
          reqPermit = true
        }
      }
      if (widestPiece > eq.maxWidth) {
        if (!eq.canExWidth) {
          hasFailed = true
        } else {
          reqPermit = true
        }
      }
      if (tallestPiece > eq.maxHeight) {
        if (!eq.canExHeight) {
          hasFailed = true
        } else {
          reqPermit = true
        }
      }
  
      if (heaviestPiece > eq.maxWeight) {
        if (!eq.canExWeight) {
          hasFailed = true
        } else {
          reqPermit = true
        }
      }
  
      if (!eq.canExLength && !eq.canExWidth && !eq.canExHeight) {
        if (!hasFailed) {
          if (+cuArea > +eqCu) {
            numTrucks = Math.ceil(cuArea / eqCu)
          }
        }
      }
  
      if (+sqArea > +eqSq) {
        numTrucks = Math.ceil(sqArea / eqSq)
      }
  
      if (totalWeight > eq.maxWeight) {
        let numTrucksWgt = Math.ceil(totalWeight / eq.maxWeight)
  
        if (numTrucksWgt > numTrucks) {
          numTrucks = numTrucksWgt
        }
      }
  
      if (numTrucks > totalQuantity) {
        numTrucks = totalQuantity
      }
  
      let tmpEqObj = {
        failed: !hasFailed ? false : true,
        label: eq.label,
        numEq: numTrucks,
        icon: eq.icon,
        reqPermit: reqPermit ? true : false,
      }
  
      eqRes.push(tmpEqObj)
    })
  
    eqRes.map((eq) => {
      if (!eq.failed) {
        possibleEq.push(eq)
      }
    })
  
    finalObj.possibleEq = possibleEq
    finalObj.reqPermit = reqPermit
  
    finalObj.pieceInfo = workableObject
  
    if (dimTo === 'cm') {
      finalObj.pieceInfo.map((row, key) => {
        finalObj.pieceInfo[key].dimL = Math.ceil(convertToCM(row.dimL))
        finalObj.pieceInfo[key].dimW = Math.ceil(convertToCM(row.dimW))
        finalObj.pieceInfo[key].dimH = Math.ceil(convertToCM(row.dimH))
        finalObj.pieceInfo[key].sqArea = convertToM2(row.sqArea).toFixed(2)
        finalObj.pieceInfo[key].cuArea = convertToM3(row.cuArea).toFixed(2)
      })
    }
    if (wgtTo === 'kg') {
      finalObj.pieceInfo.map((row, key) => {
        if (row.weight !== 0) {
          finalObj.pieceInfo[key].weight = Math.ceil(convertToKG(row.weight))
        }
      })
    }
  
    if (dimTo === 'in') {
      finalObj.pieceInfo.map((row, key) => {
        finalObj.pieceInfo[key].dimL = Math.ceil(row.dimL)
        finalObj.pieceInfo[key].dimW = Math.ceil(row.dimW)
        finalObj.pieceInfo[key].dimH = Math.ceil(row.dimH)
        finalObj.pieceInfo[key].sqArea = row.sqArea.toFixed(2)
        finalObj.pieceInfo[key].cuArea = row.cuArea.toFixed(2)
      })
    }
    if (wgtTo === 'lb') {
      finalObj.pieceInfo.map((row, key) => {
        if (row.weight !== 0) {
          finalObj.pieceInfo[key].weight = Math.ceil(row.weight)
        }
      })
    }
  
    finalObj.totalQuantity = totalQuantity
    finalObj.longestPiece =
      dimTo !== 'cm'
        ? Math.ceil(longestPiece)
        : Math.ceil(convertToCM(longestPiece))
    finalObj.widestPiece =
      dimTo !== 'cm'
        ? Math.ceil(widestPiece)
        : Math.ceil(convertToCM(widestPiece))
    finalObj.tallestPiece =
      dimTo !== 'cm'
        ? Math.ceil(tallestPiece)
        : Math.ceil(convertToCM(tallestPiece))
    finalObj.heaviestPiece =
      wgtTo !== 'kg'
        ? Math.ceil(heaviestPiece)
        : Math.ceil(convertToKG(heaviestPiece))
    finalObj.totalWeight =
      wgtTo !== 'kg'
        ? Math.ceil(totalWeight)
        : Math.ceil(convertToKG(totalWeight))
    finalObj.sqArea =
      dimTo !== 'cm' ? sqArea.toFixed(2) : convertToM2(sqArea).toFixed(2)
    finalObj.cuArea =
      dimTo !== 'cm' ? cuArea.toFixed(2) : convertToM3(cuArea).toFixed(2)
    finalObj.density = (+totalWeight / +cuArea).toFixed(2)
    finalObj.calculatedClass = calcClass(+totalWeight / +cuArea)
    finalObj.spaceOnTruck =
      dimTo !== 'cm'
        ? spaceOnTruck.toFixed(1)
        : (convertToCM(spaceOnTruck * 12) / 100).toFixed(1)
        
    return finalObj
  }
  
  module.exports = doTheMath
  
  const convertToInches = (num, dimFrom) => {
    let dim = num
  
    if (dimFrom === 'mm') {
      dim = dim / 10
    }
  
    dim = dim * 0.393701
    return dim
  }
  
  const convertToPounds = (num) => {
    return num * 2.2046
  }
  
  const convertToCM = (num) => {
    return num * 2.54
  }
  
  const convertToKG = (num) => {
    return num * 0.453592
  }
  
  const convertToM3 = (num) => {
    return num * 0.0283168
  }
  
  const convertToM2 = (num) => {
    return num * 0.092903
  }
  
  const calcClass = (density) => {
    let freightClass = ''
  
    if (density >= 40) {
      freightClass = '50'
    }
  
    if (density > 30 && density < 40) {
      freightClass = '60'
    }
    if (density >= 22.5 && density < 30) {
      freightClass = '60'
    }
    if (density >= 15 && density < 22.5) {
      freightClass = '70'
    }
    if (density >= 12 && density < 15) {
      freightClass = '85'
    }
    if (density >= 10 && density < 12) {
      freightClass = '92.5'
    }
    if (density >= 8 && density < 10) {
      freightClass = '100'
    }
    if (density >= 6 && density < 8) {
      freightClass = '125'
    }
    if (density >= 4 && density < 6) {
      freightClass = '150'
    }
    if (density >= 2 && density < 4) {
      freightClass = '250'
    }
    if (density >= 1 && density < 2) {
      freightClass = '300'
    }
    if (density >= 0 && density < 1) {
      freightClass = '400'
    }
  
    return freightClass
  }
  
  const eqTypes = [
    {
      id: 'dryvan-swingdoor-53',
      label: `53' Dry Van - Swing Door`,
      maxLength: 630,
      maxWidth: 98,
      maxHeight: 98,
      maxWeight: 44300,
      canExLength: false,
      canExWidth: false,
      canExHeight: false,
      canExWeight: true,
      icon: 'dryvan',
    },
    {
      id: 'dryvan-swingdoor-48',
      label: `48' Dry Van - Swing Door`,
      maxLength: 570,
      maxWidth: 98,
      maxHeight: 98,
      maxWeight: 44300,
      canExLength: false,
      canExWidth: false,
      canExHeight: false,
      canExWeight: true,
      icon: 'dryvan',
    },
    {
      id: 'dryvan-rollup-53',
      label: `48' Dry Van - Roll Up Door`,
      maxLength: 630,
      maxWidth: 98,
      maxHeight: 84,
      maxWeight: 44300,
      canExLength: false,
      canExWidth: false,
      canExHeight: false,
      canExWeight: true,
      icon: 'dryvan',
    },
    {
      id: 'dryvan-rollup-48',
      label: `48' Dry Van - Roll Up Door`,
      maxLength: 570,
      maxWidth: 98,
      maxHeight: 84,
      maxWeight: 44300,
      canExLength: false,
      canExWidth: false,
      canExHeight: false,
      canExWeight: true,
      icon: 'dryvan',
    },
    {
      id: 'reefer-rollup-53',
      label: `53' Reefer - Roll Up Door`,
      maxLength: 590,
      maxWidth: 98,
      maxHeight: 84,
      maxWeight: 42000,
      canExLength: false,
      canExWidth: false,
      canExHeight: false,
      canExWeight: true,
      icon: 'dryvan',
    },
    {
      id: 'reefer-rollup-48',
      label: `48' Reefer - Roll Up Door`,
      maxLength: 530,
      maxWidth: 98,
      maxHeight: 84,
      maxWeight: 42000,
      canExLength: false,
      canExWidth: false,
      canExHeight: false,
      canExWeight: true,
      icon: 'dryvan',
    },
    {
      id: 'reefer-swingdoor-53',
      label: `53' Reefer - Swing Door`,
      maxLength: 590,
      maxWidth: 98,
      maxHeight: 96,
      maxWeight: 42000,
      canExLength: false,
      canExWidth: false,
      canExHeight: false,
      canExWeight: true,
      icon: 'dryvan',
    },
    {
      id: 'reefer-swingdoor-48',
      label: `48' Reefer - Swing Door`,
      maxLength: 530,
      maxWidth: 98,
      maxHeight: 96,
      maxWeight: 42000,
      canExLength: false,
      canExWidth: false,
      canExHeight: false,
      canExWeight: true,
      icon: 'dryvan',
    },
    {
      id: 'flatbed-48',
      label: `48' Flatbed`,
      maxLength: 576,
      maxWidth: 102,
      maxHeight: 102,
      maxWeight: 48000,
      canExLength: true,
      canExWidth: true,
      canExHeight: true,
      canExWeight: true,
      icon: 'flatbed',
    },
    {
      id: 'flatbed-40',
      label: `40' Flatbed`,
      maxLength: 480,
      maxWidth: 102,
      maxHeight: 102,
      maxWeight: 48000,
      canExLength: true,
      canExWidth: true,
      canExHeight: true,
      canExWeight: true,
      icon: 'flatbed',
    },
    {
      id: 'stepdeck-standard-48',
      label: `48' Step Deck - Standard`,
      maxLength: 444,
      maxWidth: 102,
      maxHeight: 120,
      maxWeight: 48000,
      canExLength: true,
      canExWidth: true,
      canExHeight: true,
      canExWeight: true,
      icon: 'stepdeck',
    },
    {
      id: 'stepdeck-lowprofile-48',
      label: `48' Step Deck - Low Profile`,
      maxLength: 444,
      maxWidth: 102,
      maxHeight: 126,
      maxWeight: 48000,
      canExLength: true,
      canExWidth: true,
      canExHeight: true,
      canExWeight: true,
      icon: 'stepdeck',
    },
    {
      id: 'double-drop-48',
      label: `Double-Drop`,
      maxLength: 348,
      maxWidth: 102,
      maxHeight: 138,
      maxWeight: 48000,
      canExLength: false,
      canExWidth: true,
      canExHeight: true,
      canExWeight: true,
      icon: 'double-drop',
    },
    {
      id: 'rgn-48',
      label: `RGN (Removable Goose Neck)`,
      maxLength: 348,
      maxWidth: 102,
      maxHeight: 144,
      maxWeight: 44000,
      canExLength: false,
      canExWidth: true,
      canExHeight: true,
      canExWeight: true,
      icon: 'rgn',
    },
  ]