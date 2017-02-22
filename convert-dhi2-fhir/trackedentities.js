// Generated by CoffeeScript 1.8.0
(function() {
  var app, encounters, express, records, server;

  express = require("express");
  var entityAPI =require ("./lib/api");
  var fhirStructureAPI =require ("./lib/fhirStructure");
  var entitieTrackedMapping= entityAPI.GetTrackedEntitiesMapping();
  var Identifier=fhirStructureAPI.Identifier;
  var Organization=fhirStructureAPI.Organization;
  var CodeableConcept=fhirStructureAPI.CodeableConcept;
  var Patient=fhirStructureAPI.Patient;
  var HumanName=fhirStructureAPI.HumanName;
  var ContactPoint=fhirStructureAPI.ContactPoint;
  var Practitioner=fhirStructureAPI.Practitioner;
  var Specimen=fhirStructureAPI.Specimen;
  var Collection=fhirStructureAPI.Collection;
  var Container=fhirStructureAPI.Container;
  var DiagnosticOrder=fhirStructureAPI.DiagnosticOrder;
  var Observation=fhirStructureAPI.Observation;
  var SampledData=fhirStructureAPI.SampledData;
  var Quantity=fhirStructureAPI.Quantity;
  var Period=fhirStructureAPI.Period;
  var Range=fhirStructureAPI.Range;
  var Ratio=fhirStructureAPI.Ratio;
  var DiagnosticReport=fhirStructureAPI.DiagnosticReport;
  var Entry=fhirStructureAPI.Entry;
  var Bundle=fhirStructureAPI.Bundle;
  //console.log(Identifier);
	function SearchOrgUnitInThelist(idOrgUnit,OrgUnitsList)
	{
		var orgUnitFound=null;
		for(var i=0;i<OrgUnitsList.length;i++)
		{
			if(OrgUnitsList[i].id==idOrgUnit)
			{
				orgUnitFound=OrgUnitsList[i];
				break;
			}
			else
			{
				continue;
			}

		}
		return orgUnitFound;
	}
	function BuildOrganizationHierarchy(OrgUnitsList)
	{
		var organizationList=[];
		var baselevel1=1;
		//console.log("Trace: "+OrgUnitsList.length);
		for(var i=0; i<OrgUnitsList.length;i++)
		{
			//Search for the OrgUnit with the lowest level: 1
			var oOrgUnit= OrgUnitsList[i];
			//console.log("Trace: ");
			//console.log(oOrgUnit.level==baselevel1);
			if(oOrgUnit.level==baselevel1 && oOrgUnit.dimensionItemType=="ORGANISATION_UNIT")
			{
				//console.log("Trace: Enter1"+JSON.stringify(oOrgUnit));
				//initialisation
				var org={};
				org= Object.create(Organization);
				org.resourceType="Organization";
				var orgIdentifier={};
				orgIdentifier=Object.create(Identifier);
				//assignment of Identifier
				orgIdentifier.use="official";
				orgIdentifier.type={"text":"DHIS2 Internal Identifier"};
				orgIdentifier.system="DHIS2 ID System";
				orgIdentifier.value=oOrgUnit.id;
				//assignment of type
				var orgUnitCoding=Object.create(CodeableConcept);
				orgUnitCoding.coding=[{"system":"https://www.hl7.org/fhir"}];
				orgUnitCoding.text=oOrgUnit.shortName;
				org.type=orgUnitCoding;
				//assigment of OrgUnit
				org.id=oOrgUnit.id;
				org.meta={"lastUpdated":oOrgUnit.lastUpdated};
				org.identifier=[orgIdentifier];
				org.name=oOrgUnit.name;
				organizationList.push(org);
				if(oOrgUnit.children.length>0)
				{
					//level 2
					//console.log("Trace: Enter2");
					var baselevel2=baselevel1+1;
					for(var j=0; j<oOrgUnit.children.length;j++){
					//initialisation
					var oOrgUnit2=SearchOrgUnitInThelist(oOrgUnit.children[j].id,OrgUnitsList);
					if(oOrgUnit2.level==baselevel2 && oOrgUnit2.dimensionItemType=="ORGANISATION_UNIT")
					{
						//console.log("#####################");
						var org2={};
						org2=Object.create(Organization);
						org2.resourceType="Organization";
						orgIdentifier={};
						orgIdentifier=Object.create(Identifier);
						//assignment of Identifier
						orgIdentifier.use="official";
						orgIdentifier.type={"text":"DHIS2 Internal Identifier"};
						orgIdentifier.system="DHIS2 ID System";
						orgIdentifier.value=oOrgUnit2.id;
						//assignment of type
						orgUnitCoding=Object.create(CodeableConcept);
						orgUnitCoding.coding=[{"system":"https://www.hl7.org/fhir"}];
						orgUnitCoding.text=oOrgUnit.shortName;
						org2.type=orgUnitCoding;
						//assigment of OrgUnit
						org2.id=oOrgUnit2.id;
						org2.meta={"lastUpdated":oOrgUnit2.lastUpdated};
						org2.identifier=[orgIdentifier];
						org2.name=oOrgUnit2.name;
						org2.partOf={"reference":"Organization/"+oOrgUnit.id}
						//org2.partOf=oOrgUnit.id;
						organizationList.push(org2);
						if(oOrgUnit2.children.length>0)
						{
							//level 3
							var baselevel3=baselevel1+2;
							for(var k=0; k<oOrgUnit2.children.length;k++){
							//initialisation
							var oOrgUnit3=SearchOrgUnitInThelist(oOrgUnit2.children[k].id,OrgUnitsList);
							if(oOrgUnit3.level==baselevel3 && oOrgUnit3.dimensionItemType=="ORGANISATION_UNIT")
							{
								var org3={};
								org3=Object.create(Organization);
								org3.resourceType="Organization";
								orgIdentifier={};
								orgIdentifier=Object.create(Identifier);
								//assignment of Identifier
								orgIdentifier.use="official";
								orgIdentifier.type={"text":"DHIS2 Internal Identifier"};
								orgIdentifier.system="DHIS2 ID System";
								orgIdentifier.value=oOrgUnit3.id;
								//assignment of type
								orgUnitCoding=Object.create(CodeableConcept);
								orgUnitCoding.coding=[{"system":"https://www.hl7.org/fhir"}];
								orgUnitCoding.text=oOrgUnit.shortName;
								org3.type=orgUnitCoding;
								//assigment of OrgUnit
								org3.id=oOrgUnit3.id;
								org3.meta={"lastUpdated":oOrgUnit3.lastUpdated};
								org3.identifier=[orgIdentifier];
								org3.name=oOrgUnit3.name;
								//org3.partOf=oOrgUnit2.id;
								org3.partOf={"reference":"Organization/"+oOrgUnit2.id}
								organizationList.push(org3);
								if(oOrgUnit3.children.length>0)
								{
									//level 4
									var baselevel4=baselevel1+3;
									for(var l=0; l<oOrgUnit3.children.length;l++){
									//initialisation
									//var oOrgUnit4= oOrgUnit3.children[l];
									var oOrgUnit4=SearchOrgUnitInThelist(oOrgUnit3.children[l].id,OrgUnitsList);
									if(oOrgUnit4.level==baselevel4 && oOrgUnit4.dimensionItemType=="ORGANISATION_UNIT")
									{
										var org4={};
										org4=Object.create(Organization);
										org4.resourceType="Organization";
										orgIdentifier={};
										orgIdentifier=Object.create(Identifier);
										//assignment of Identifier
										orgIdentifier.use="official";
										orgIdentifier.type={"text":"DHIS2 Internal Identifier"};
										orgIdentifier.system="DHIS2 ID System";
										orgIdentifier.value=oOrgUnit4.id;
										//assignment of type
										orgUnitCoding=Object.create(CodeableConcept);
										orgUnitCoding.coding=[{"system":"https://www.hl7.org/fhir"}];
										orgUnitCoding.text=oOrgUnit.shortName;
										org4.type=orgUnitCoding;
										//assigment of OrgUnit
										org4.id=oOrgUnit4.id;
										org4.meta={"lastUpdated":oOrgUnit4.lastUpdated};
										org4.identifier=[orgIdentifier];
										org4.name=oOrgUnit4.name;
										//org4.partOf=oOrgUnit3.id;
										org4.partOf={"reference":"Organization/"+oOrgUnit3.id}
										organizationList.push(org4);
										//console.log("org4: "+JSON.stringify(organizationList[3]));
									}
									}
									//console.log("org3: "+JSON.stringify(organizationList[2]));
								}
							}
							
							
							}
						}
					}
					else{
						continue;
						}
					
					}
				}
				
			}
			else
			{
				continue;
			}
			//if(oOrgUnit.)
		}
		
		return organizationList;
	}
	function GetAssociatedFhirResource(oTrackedEntity)
	{
		const entityCode=oTrackedEntity.trackedEntity;
		var entityObject=null;
		switch(entityCode)
		{
			case entitieTrackedMapping.patient:
				//extract patient attribute
				var oPatient={};
				oPatient= Object.create(Patient);
				oPatient.resourceType="Patient";
				oPatient.id=oTrackedEntity.trackedEntityInstance;
				oPatient.meta={"lastUpdated":oTrackedEntity.lastUpdated};
				oPatient.active=true;
				//oPatient.managingOrganization=oTrackedEntity.orgUnit;
				oPatient.managingOrganization={"reference":"Organization/"+oTrackedEntity.orgUnit}
				var oName={};
				oName= Object.create(HumanName);
				oName.resourceType="HumanName";
				oName.use="official";
				//
				var oContact={};
				oContact= Object.create(ContactPoint);
				oContact.resourceType="ContactPoint";
				
				var listOfIdentifier=[];
				var firstEntry=false;
				for(var i=0;i<oTrackedEntity.attributes.length;i++)
				{
					if(oTrackedEntity.attributes[i].displayName=="Identifier")
					{
						var orgIdentifier={};
						orgIdentifier=Object.create(Identifier);
						//assignment of Identifier
						orgIdentifier.use="official";
						orgIdentifier.type={"text":"Medical Record Number"};
						orgIdentifier.system="http://hl7.org/fhir/";
						orgIdentifier.value=oTrackedEntity.attributes[i].value;
						listOfIdentifier.push(orgIdentifier);
						
					}
					if(oTrackedEntity.attributes[i].displayName=="LastName" || oTrackedEntity.attributes[i].displayName=="FirstName")
					{
						if(oTrackedEntity.attributes[i].displayName=="LastName")
						{
							oName.family=oTrackedEntity.attributes[i].value;
							oName.text+=oTrackedEntity.attributes[i].value;
						}
						if(oTrackedEntity.attributes[i].displayName=="FirstName")
						{
							oName.given=oTrackedEntity.attributes[i].value;
							oName.text=oTrackedEntity.attributes[i].value+" "+oName.text;
						}
					}
					if(oTrackedEntity.attributes[i].displayName=="Telephone")
					{
						oContact.system="phone";
						oContact.value=oTrackedEntity.attributes[i].value;
						oContact.use="home";
						oContact.rank="1";
						oPatient.telecom=[oContact];
					}
					if(oTrackedEntity.attributes[i].displayName=="Sex")
					{
						oPatient.gender=oTrackedEntity.attributes[i].value;
					}
					if(oTrackedEntity.attributes[i].displayName=="birthDate")
					{
						oPatient.birthDate=oTrackedEntity.attributes[i].value;
					}
					
				}//fin for
				oPatient.identifier=listOfIdentifier;
				//oPatient.active=true;
				oPatient.deceasedBoolean=false;
				oPatient.name=[oName];
				entityObject=oPatient;
				break;
				
			case entitieTrackedMapping.provider:
				//extract patient attribute
				var oPractitioner={};
				oPractitioner= Object.create(Practitioner);
				oPractitioner.resourceType="Practitioner";
				oPractitioner.id=oTrackedEntity.trackedEntityInstance;
				oPractitioner.meta={"lastUpdated":oTrackedEntity.lastUpdated};
				oPractitioner.active=true;
				oPractitioner.qualification=[{"managingOrganization": {"reference":"Organization/"+oTrackedEntity.orgUnit}}];
				var oName={};
				oName= Object.create(HumanName);
				oName.resourceType="HumanName";
				oName.use="official";
				//
				var oContact={};
				oContact= Object.create(ContactPoint);
				oContact.resourceType="ContactPoint";
				
				var listOfIdentifier=[];
				for(var i=0;i<oTrackedEntity.attributes.length;i++)
				{
					if(oTrackedEntity.attributes[i].displayName=="LastName" || oTrackedEntity.attributes[i].displayName=="FirstName")
					{
						if(oTrackedEntity.attributes[i].displayName=="LastName")
						{
							oName.family=oTrackedEntity.attributes[i].value;
							oName.text+=oTrackedEntity.attributes[i].value;
						}
						if(oTrackedEntity.attributes[i].displayName=="FirstName")
						{
							oName.given=oTrackedEntity.attributes[i].value;
							oName.text=oTrackedEntity.attributes[i].value+" "+oName.text;
						}
					}
					if(oTrackedEntity.attributes[i].displayName=="Identifier")
					{
						var orgIdentifier={};
						orgIdentifier=Object.create(Identifier);
						//assignment of Identifier
						orgIdentifier.use="official";
						orgIdentifier.type={"text":"License Number"};
						orgIdentifier.system="http://hl7.org/fhir/";
						orgIdentifier.value=oTrackedEntity.attributes[i].value;
						listOfIdentifier.push(orgIdentifier);
						
					}
					if(oTrackedEntity.attributes[i].displayName=="Sex")
					{
						oPractitioner.gender=oTrackedEntity.attributes[i].value;
					}
				}
				oPractitioner.identifier=listOfIdentifier;
				oPractitioner.name=oName;
				entityObject=oPractitioner;
				break;
			case entitieTrackedMapping.specimen:
				var oSpecimen={};
				oSpecimen= Object.create(Specimen);
				oSpecimen.resourceType="Specimen";
				oSpecimen.id=oTrackedEntity.trackedEntityInstance;
				oSpecimen.meta={"lastUpdated":oTrackedEntity.lastUpdated};
				oSpecimen.active=true;
				var listOfIdentifier=[];
				var listOfTraitment=[];
				var oConceptProcedure={};
				oConceptProcedure= Object.create(CodeableConcept);
				var oConceptCollectionMethod={};
				oConceptCollectionMethod= Object.create(CodeableConcept);
				var oConceptBodySite={};
				oConceptBodySite= Object.create(CodeableConcept);
				//oConceptProcedure.
				var oTraitment={
					"description":"",
					"procedure":{}
					};
				var oCollection={};
				oCollection= Object.create(Collection);
				var oContainer={};
				oContainer= Object.create(Container);
				
				for(var i=0;i<oTrackedEntity.attributes.length;i++)
				{
					if(oTrackedEntity.attributes[i].displayName=="SpecimenTreatmentDescription")
					{
						oTraitment.description=oTrackedEntity.attributes[i].value;
					}
					if(oTrackedEntity.attributes[i].displayName=="SpecimenTreatementProcedure")
					{
						oConceptProcedure.text=oTrackedEntity.attributes[i].value;
						oTraitment.procedure=oConceptProcedure;
					}
					if(oTrackedEntity.attributes[i].displayName=="DateOfReception")
					{
						oSpecimen.receivedTime=oTrackedEntity.attributes[i].value;
					}
					if(oTrackedEntity.attributes[i].displayName=="DateOfCollection")
					{
						oCollection.collectedDateTime=oTrackedEntity.attributes[i].value;
					}
					if(oTrackedEntity.attributes[i].displayName=="QuantityUnit")
					{
						oCollection.quantity.unit=oTrackedEntity.attributes[i].value;
					}
					if(oTrackedEntity.attributes[i].displayName=="Quantity")
					{
						oCollection.quantity.value=oTrackedEntity.attributes[i].value;
					}
					if(oTrackedEntity.attributes[i].displayName=="SpecimenCollectionMethod")
					{
						oConceptCollectionMethod.text=oTrackedEntity.attributes[i].value;
						oCollection.method=oConceptCollectionMethod;
					}
					if(oTrackedEntity.attributes[i].displayName=="SpecimenBodySite")
					{
						oConceptBodySite.text=oTrackedEntity.attributes[i].value;
						oCollection.bodySite=oConceptBodySite;
					}
					if(oTrackedEntity.attributes[i].displayName=="Identifier")
					{
						var oIdentifier={};
						oIdentifier=Object.create(Identifier);
						//assignment of Identifier
						oIdentifier.use="official";
						oIdentifier.type={"text":"Specimen Identification"};
						oIdentifier.system="http://hl7.org/fhir";
						oIdentifier.value=oTrackedEntity.attributes[i].value;
						listOfIdentifier.push(oIdentifier);
					}
					if(oTrackedEntity.attributes[i].displayName=="LabIdentifier")
					{
						var oIdentifier={};
						oIdentifier=Object.create(Identifier);
						//assignment of Identifier
						oIdentifier.use="official";
						oIdentifier.type={"text":"Lab Identification"};
						oIdentifier.system="http://hl7.org/fhir";
						oIdentifier.value=oTrackedEntity.attributes[i].value;
						//listOfIdentifier.push(oIdentifier);
						oSpecimen.accessionIdentifier=oIdentifier;
					}
					if(oTrackedEntity.attributes[i].displayName=="ContainerCapacityUnit")
					{
						oContainer.capacity.unit=oTrackedEntity.attributes[i].value;
					}
					if(oTrackedEntity.attributes[i].displayName=="ContainerCapacity")
					{
						oContainer.capacity.value=oTrackedEntity.attributes[i].value;
					}
					if(oTrackedEntity.attributes[i].displayName=="ContainerIdentifier")
					{
						var oIdentifier={};
						oIdentifier=Object.create(Identifier);
						//assignment of Identifier
						oIdentifier.use="official";
						oIdentifier.type={"text":"Container Identification"};
						oIdentifier.system="http://hl7.org/fhir";
						oIdentifier.value=oTrackedEntity.attributes[i].value;
						oContainer.Identifier=[oIdentifier];
					}
					if(oTrackedEntity.attributes[i].displayName=="ContainerDescription")
					{
						oContainer.description=oTrackedEntity.attributes[i].value;
					}
				}
				oSpecimen.Identifier=listOfIdentifier;
				oSpecimen.status="available";
				oSpecimen.collection=oCollection;
				oSpecimen.treatment=[oTraitment];
				oSpecimen.Container=[oContainer];
				entityObject=oSpecimen;
				break;
			case entitieTrackedMapping.order:
				var oOrder={};
				oOrder= Object.create(DiagnosticOrder);
				oOrder.resourceType="DiagnosticOrder";
				oOrder.id=oTrackedEntity.trackedEntityInstance;
				oOrder.meta={"lastUpdated":oTrackedEntity.lastUpdated};
				//oOrder.
				var listOfIdentifier=[];
				for(var i=0;i<oTrackedEntity.attributes.length;i++)
				{
					if(oTrackedEntity.attributes[i].displayName=="Orderer")
					{
						oOrder.orderer={"reference":"Practitioner/"+oTrackedEntity.attributes[i].value};
					}
					else if (oTrackedEntity.attributes[i].displayName=="Identifier")
					{
						var oIdentifier={};
						oIdentifier=Object.create(Identifier);
						//assignment of Identifier
						oIdentifier.use="official";
						oIdentifier.type={"text":"Order Identification"};
						oIdentifier.system="http://hl7.org/fhir";
						oIdentifier.value=oTrackedEntity.attributes[i].value;
						listOfIdentifier.push(oIdentifier);
					}
					else if (oTrackedEntity.attributes[i].displayName=="OrderRaison")
					{
						var oConcept={};
						oConcept= Object.create(CodeableConcept);
						oConcept.text=oTrackedEntity.attributes[i].value;
						oOrder.reason=[oConcept];
					}
					else if(oTrackedEntity.attributes[i].displayName=="Specimen")
					{
						oOrder.specimen={"reference":"Specimen/"+oTrackedEntity.attributes[i].value};
					}
					else if(oTrackedEntity.attributes[i].displayName=="Subject")
					{
						oOrder.subject={"reference":"Patient/"+oTrackedEntity.attributes[i].value};
					}
					else if(oTrackedEntity.attributes[i].displayName=="OrderPriority")
					{
						oOrder.priority=oTrackedEntity.attributes[i].value;
					}
					else if(oTrackedEntity.attributes[i].displayName=="OrderStatus")
					{
						oOrder.status=oTrackedEntity.attributes[i].value;
					}
					else if(oTrackedEntity.attributes[i].displayName=="Comment")
					{
						oOrder.note={"text":oTrackedEntity.attributes[i].value};
					}
					
					
				}
				oOrder.Identifier=listOfIdentifier;
				entityObject=oOrder;
				break;
			case entitieTrackedMapping.observation:
				var oObservation={};
				oObservation= Object.create(Observation);
				oObservation.resourceType="Observation";
				oObservation.id=oTrackedEntity.trackedEntityInstance;
				oObservation.meta={"lastUpdated":oTrackedEntity.lastUpdated};
				//oOrder.
				var listOfIdentifier=[];
				var oSampledData={};
				oSampledData= Object.create(SampledData);
				var oPeriodEffective={};
				oPeriodEffective= Object.create(Period);
				var oValueQuantity={};
				oValueQuantity= Object.create(Quantity);
				var oOriginQuantity={};
				oOriginQuantity= Object.create(Quantity);
				var oObservationRange={};
				oObservationRange=Object.create(Range);
				var oObservationRatio={};
				oObservationRatio=Object.create(Ratio);
				var oBodySiteConcept={};
				oBodySiteConcept=Object.create(CodeableConcept);
				var oAbsentRaisonConcept={};
				oAbsentRaisonConcept=Object.create(CodeableConcept);
				
				for(var i=0;i<oTrackedEntity.attributes.length;i++)
				{
					if (oTrackedEntity.attributes[i].displayName=="Identifier")
					{
						var oIdentifier={};
						oIdentifier=Object.create(Identifier);
						//assignment of Identifier
						oIdentifier.use="official";
						oIdentifier.type={"text":"Observation Identification"};
						oIdentifier.system="http://hl7.org/fhir";
						oIdentifier.value=oTrackedEntity.attributes[i].value;
						listOfIdentifier.push(oIdentifier);
					}
					else if (oTrackedEntity.attributes[i].displayName=="ObservationStatus")
					{
						oObservation.status=oTrackedEntity.attributes[i].value;
					}
					else if (oTrackedEntity.attributes[i].displayName=="ObservationCategorie")
					{
						var  oConcept={};
						oConcept= Object.create(CodeableConcept);
						oConcept.text=oTrackedEntity.attributes[i].value;
						oObservation.category=oConcept;
					}
					else if (oTrackedEntity.attributes[i].displayName=="ObservationCode")
					{
						var  oConcept={};
						oConcept= Object.create(CodeableConcept);
						oConcept.text=oTrackedEntity.attributes[i].value;
						oObservation.code=oConcept;
					}
					else if (oTrackedEntity.attributes[i].displayName=="Subject")
					{
						oObservation.subject={"reference":"Patient/"+oTrackedEntity.attributes[i].value};
					}
					else if (oTrackedEntity.attributes[i].displayName=="ObservationEffectiveDateTime")
					{
						oObservation.effectiveDateTime=oTrackedEntity.attributes[i].value;
					}
					else if (oTrackedEntity.attributes[i].displayName=="ObservationEffectivePeriodeDateSup")
					{
						oPeriodEffective.end=oTrackedEntity.attributes[i].value;
						//oObservation.effectivePeriod.end=oTrackedEntity.attributes[i].value;
					}
					else if (oTrackedEntity.attributes[i].displayName=="ObservationEffectivePeriodeDateInf")
					{
						oPeriodEffective.start=oTrackedEntity.attributes[i].value;
						//oObservation.effectivePeriod.start=oTrackedEntity.attributes[i].value;
					}
					else if (oTrackedEntity.attributes[i].displayName=="ObservationIssued")
					{
						oObservation.issued=oTrackedEntity.attributes[i].value;
					}
					else if (oTrackedEntity.attributes[i].displayName=="ObservationPerformer")
					{
						oObservation.performer=[{"reference":"Practitioner/"+oTrackedEntity.attributes[i].value}];
					}
					else if (oTrackedEntity.attributes[i].displayName=="ResultValueQuantityUnit")
					{
						oValueQuantity.unit=oTrackedEntity.attributes[i].value;
						//oObservation.valueQuantity.unit=oTrackedEntity.attributes[i].value;
					}
					else if (oTrackedEntity.attributes[i].displayName=="ResultValueQuantityValue")
					{
						oValueQuantity.value=oTrackedEntity.attributes[i].value;
						//oObservation.valueQuantity.value=oTrackedEntity.attributes[i].value;
					}
					else if (oTrackedEntity.attributes[i].displayName=="ResultValueString")
					{
						oObservation.valueString=oTrackedEntity.attributes[i].value;
					}
					else if (oTrackedEntity.attributes[i].displayName=="ResultValueRangeSup")
					{
						var rangeQuantity=Object.create(Quantity);
						rangeQuantity.value=oTrackedEntity.attributes[i].value;
						oObservationRange.high=rangeQuantity;
						//oObservation.valueRange.high=oTrackedEntity.attributes[i].value;
					}
					else if (oTrackedEntity.attributes[i].displayName=="ResultValueRangeInf")
					{
						var rangeQuantity=Object.create(Quantity);
						rangeQuantity.value=oTrackedEntity.attributes[i].value;
						oObservationRange.low=rangeQuantity;
						//oObservation.valueRange.low=oTrackedEntity.attributes[i].value;
					}
					else if (oTrackedEntity.attributes[i].displayName=="ResultValueRatioNum")
					{
						oObservationRatio.numerator=oTrackedEntity.attributes[i].value;
						//oObservation.valueRatio.numerator=oTrackedEntity.attributes[i].value;
					}
					else if (oTrackedEntity.attributes[i].displayName=="ResultValueRatioDenom")
					{
						oObservationRatio.denominator=oTrackedEntity.attributes[i].value;
						//oObservation.valueRatio.denominator=oTrackedEntity.attributes[i].value;
					}
					else if (oTrackedEntity.attributes[i].displayName=="ResultValueDateTime")
					{
						oObservation.valueDateTime=oTrackedEntity.attributes[i].value;
					}
					else if (oTrackedEntity.attributes[i].displayName=="ResultValueTime")
					{
						oObservation.valueTime=oTrackedEntity.attributes[i].value;
					}
					else if (oTrackedEntity.attributes[i].displayName=="ResultSampleDataData")
					{
						oSampledData.data=oTrackedEntity.attributes[i].value;
						//oObservation.valueSampledData=oSampledData;
					}
					else if (oTrackedEntity.attributes[i].displayName=="ResultSampleDataOrigin")
					{
						oOriginQuantity.value=oTrackedEntity.attributes[i].value;
						//oSampledData.origin.value=oTrackedEntity.attributes[i].value;
						//oObservation.valueSampledData.origin.value=oTrackedEntity.attributes[i].value;
					}
					else if (oTrackedEntity.attributes[i].displayName=="ResultSampleDataFactor")
					{
						oSampledData.factor=oTrackedEntity.attributes[i].value;
						//oObservation.valueSampledData.factor=oTrackedEntity.attributes[i].value;
					}
					else if (oTrackedEntity.attributes[i].displayName=="ResultBodySite")
					{
						oBodySiteConcept.text=oTrackedEntity.attributes[i].value;
						//oObservation.bodySite.text=oTrackedEntity.attributes[i].value;
						oObservation.bodySite=oBodySiteConcept;
					}
					else if (oTrackedEntity.attributes[i].displayName=="ResultSampleDataUpper")
					{
						oSampledData.upperLimit=oTrackedEntity.attributes[i].value;
						//oObservation.valueSampledData.upperLimit=oTrackedEntity.attributes[i].value;
					}
					else if (oTrackedEntity.attributes[i].displayName=="ResultDataAbsentReason")
					{
						oAbsentRaisonConcept.text=oTrackedEntity.attributes[i].value;
						oObservation.dataAbsentReason=oAbsentRaisonConcept;
					}
					else if (oTrackedEntity.attributes[i].displayName=="ResultSampleDataLower")
					{
						oSampledData.lowerLimit=oTrackedEntity.attributes[i].value;
						//oObservation.valueSampledData.lowerLimit=oTrackedEntity.attributes[i].value;
					}
					else if (oTrackedEntity.attributes[i].displayName=="ResultSampleDataDimension")
					{
						oSampledData.dimensions=oTrackedEntity.attributes[i].value;
						//oObservation.valueSampledData.dimensions=oTrackedEntity.attributes[i].value;
					}
					else if (oTrackedEntity.attributes[i].displayName=="ResultSampleDataPeriod")
					{
						oSampledData.period=oTrackedEntity.attributes[i].value;
						//oObservation.valueSampledData.period=oTrackedEntity.attributes[i].value;
					}
					else if (oTrackedEntity.attributes[i].displayName=="ResultInterpretation")
					{
						oObservation.interpretation=oTrackedEntity.attributes[i].value;
					}
					else if (oTrackedEntity.attributes[i].displayName=="ResultMethod")
					{
						var  oConcept={};
						oConcept= Object.create(CodeableConcept);
						oConcept.text=oTrackedEntity.attributes[i].value;
						oObservation.method=oConcept;
					}
					else if (oTrackedEntity.attributes[i].displayName=="ResultComments")
					{
						oObservation.comments=oTrackedEntity.attributes[i].value;
					}
					else if (oTrackedEntity.attributes[i].displayName=="Specimen")
					{
						oObservation.specimen={"reference":"Specimen/"+oTrackedEntity.attributes[i].value};
					}
				}
					oSampledData.origin=oOriginQuantity;
					oObservation.valueSampledData=oSampledData;
					oObservation.identifier=listOfIdentifier;
					oObservation.effectivePeriod=oPeriodEffective;
					oObservation.valueQuantity=oValueQuantity;
					oObservation.valueRange=oObservationRange;
					oObservation.valueRatio=oObservationRatio;
					
					entityObject=oObservation;
				break;
			case entitieTrackedMapping.diagnosticReport:
				var oDiagnosticReport={};
				oDiagnosticReport= Object.create(DiagnosticReport);
				oDiagnosticReport.resourceType="DiagnosticReport";
				DiagnosticReport.id=oTrackedEntity.trackedEntityInstance;
				DiagnosticReport.meta={"lastUpdated":oTrackedEntity.lastUpdated};
				var listOfIdentifier=[];
				var oEffectivePeriod={};
				oEffectivePeriod= Object.create(Period);
				for(var i=0;i<oTrackedEntity.attributes.length;i++)
				{
					if (oTrackedEntity.attributes[i].displayName=="Identifier")
					{
						var oIdentifier={};
						oIdentifier=Object.create(Identifier);
						//assignment of Identifier
						oIdentifier.use="official";
						oIdentifier.type={"text":"DiagnosticReport Identification"};
						oIdentifier.system="http://hl7.org/fhir";
						oIdentifier.value=oTrackedEntity.attributes[i].value;
						listOfIdentifier.push(oIdentifier);
					}
					else if (oTrackedEntity.attributes[i].displayName=="DiagnosticReportCode")
					{
						var oConcept={};
						oConcept=Object.create(CodeableConcept);
						oConcept.text=oTrackedEntity.attributes[i].value;
						oDiagnosticReport.code=oConcept;
					}
					else if (oTrackedEntity.attributes[i].displayName=="Conclusion")
					{
						oDiagnosticReport.conclusion=oTrackedEntity.attributes[i].value;
					}
					else if (oTrackedEntity.attributes[i].displayName=="DiagnosticReportIssued")
					{
						oDiagnosticReport.issued=oTrackedEntity.attributes[i].value;
					}
					else if (oTrackedEntity.attributes[i].displayName=="DiagnosticReportCategory")
					{
						var oConcept={};
						oConcept=Object.create(CodeableConcept);
						oConcept.text=oTrackedEntity.attributes[i].value;
						oDiagnosticReport.category=oConcept;
					}
					else if (oTrackedEntity.attributes[i].displayName=="Request")
					{
						oDiagnosticReport.request=[{"reference":"DiagnosticOrder/"+oTrackedEntity.attributes[i].value}];
					}
					else if (oTrackedEntity.attributes[i].displayName=="Performer")
					{
						oDiagnosticReport.performer={"reference":"Practitioner/"+oTrackedEntity.attributes[i].value};
					}
					else if (oTrackedEntity.attributes[i].displayName=="DiagnosticStatus")
					{
						oDiagnosticReport.status=oTrackedEntity.attributes[i].value;
					}
					else if (oTrackedEntity.attributes[i].displayName=="DiagnosticReportEffectivePeriodStart")
					{
						oEffectivePeriod.start=oTrackedEntity.attributes[i].value;
					}
					else if (oTrackedEntity.attributes[i].displayName=="Result")
					{
						oDiagnosticReport.result=[{"reference":"Observation/"+oTrackedEntity.attributes[i].value}];
					}
					else if (oTrackedEntity.attributes[i].displayName=="Subject")
					{
						oDiagnosticReport.subject={"reference":"Patient/"+oTrackedEntity.attributes[i].value};
					}
					else if (oTrackedEntity.attributes[i].displayName=="Specimen")
					{
						oDiagnosticReport.specimen=[{"reference":"Specimen/"+oTrackedEntity.attributes[i].value}];
					}
					else if (oTrackedEntity.attributes[i].displayName=="DiagnosticReportEffectiveDateTime")
					{
						oDiagnosticReport.effectiveDateTime=oTrackedEntity.attributes[i].value;
					}
					else if (oTrackedEntity.attributes[i].displayName=="CodedDiagnosis")
					{
						var oConcept={};
						oConcept=Object.create(CodeableConcept);
						oConcept.text=oTrackedEntity.attributes[i].value;
						oDiagnosticReport.codedDiagnosis=[oConcept];
					}
					else if (oTrackedEntity.attributes[i].displayName=="DiagnosticReportEffectivePeriodEnd")
					{
						oEffectivePeriod.end=oTrackedEntity.attributes[i].value;
					}
				}
				oDiagnosticReport.identifier=listOfIdentifier;
				oDiagnosticReport.effectivePeriod=oEffectivePeriod;
				entityObject=oDiagnosticReport;
				break;
		}
		return entityObject;
		
	}
	
	function BuildBundleResponse(listOrganisation,listPatient,listPractitioner,listSpecimen,listDiagnosticOrder,listObservation,listDiagnosticReport)
	{
		var oBundle={};
		oBundle= Object.create(Bundle);
		oBundle.resourceType="Bundle";
		//Bundle ID, Build the BundleId : Id Of one of the organization +totalnumber of the resource within the bundle
		var totalNumberOfResource=listOrganisation.length+listPatient.length+listPractitioner.length;
		totalNumberOfResource+=listSpecimen.length+listDiagnosticOrder.length+listObservation.length+listDiagnosticReport.length;
		var idBundle=listOrganisation[0].id+totalNumberOfResource;
		oBundle.id=idBundle;
		oBundle.meta={"lastUpdated":new Date().toJSON()};
		oBundle.type="collection";
		oBundle.total=totalNumberOfResource;
		var listOfEntries=[];
		for (var i=0;i<listOrganisation.length;i++)
		{
			var oEntry=Object.create(Entry);
			oEntry.resource=listOrganisation[i];
			oEntry.search.mode="match";
			listOfEntries.push(oEntry);
			
		}
		for (var i=0;i<listPractitioner.length;i++)
		{
			var oEntry=Object.create(Entry);
			oEntry.resource=listPractitioner[i];
			oEntry.search.mode="match";
			listOfEntries.push(oEntry);
			
		}
		for (var i=0;i<listPatient.length;i++)
		{
			var oEntry=Object.create(Entry);
			oEntry.resource=listPatient[i];
			oEntry.search.mode="match";
			listOfEntries.push(oEntry);
		}
		for (var i=0;i<listSpecimen.length;i++)
		{
			var oEntry=Object.create(Entry);
			oEntry.resource=listSpecimen[i];
			oEntry.search.mode="match";
			listOfEntries.push(oEntry);
		}
		for (var i=0;i<listDiagnosticOrder.length;i++)
		{
			var oEntry=Object.create(Entry);
			oEntry.resource=listDiagnosticOrder[i];
			oEntry.search.mode="match";
			listOfEntries.push(oEntry);
		}
		for (var i=0;i<listObservation.length;i++)
		{
			var oEntry=Object.create(Entry);
			oEntry.resource=listObservation[i];
			oEntry.search.mode="match";
			listOfEntries.push(oEntry);
		}
		for (var i=0;i<listDiagnosticReport.length;i++)
		{
			var oEntry=Object.create(Entry);
			oEntry.resource=listDiagnosticReport[i];
			oEntry.search.mode="match";
			listOfEntries.push(oEntry);
		}
		oBundle.entry=listOfEntries;
		return oBundle;
	} 
  
	entityinstances=function(req, res, next)
	{
		console.log(new Date().toJSON()+" => Received request for tracked-entity instances");
		entityAPI.GetAllOrganisationUnits(function(listOrgUnits)
		{
			
			
			var fhirOrganizationlist=[];
			var fhirPatientList=[];
			var fhirPractitionerList=[];
			var fhirSpecimenList=[];
			var fhirDiagnosticOrderList=[];
			var fhirObservationList=[];
			var fhirDiagnosticReport=[];
			var fhirListOfResource=[];
			var reflist=[];
			//transform to list of orgunit to a list of Fhir Organization resource
			fhirOrganizationlist=BuildOrganizationHierarchy(listOrgUnits.organisationUnits);
			var listOfOrgUnitId=[]
			for(var i=0; i<fhirOrganizationlist.length;i++)
			{
				listOfOrgUnitId.push(fhirOrganizationlist[i].id);
			}
			entityAPI.GetTrackedEntityInstancesFromOrgunitList(listOfOrgUnitId,function(listTrackedEntities){
						
						//console.log(listTrackedEntities);
						if(listTrackedEntities.trackedEntityInstances.length>0)
						{
							//console.log("orgunit: "+id);
							//console.log(listTrackedEntities);
							for(var j=0;j<listTrackedEntities.trackedEntityInstances.length;j++)
							{
								//var jsonText=JSON.stringify(listTrackedEntities.trackedEntityInstances[j]);
								//var oEntity=JSON.parse(jsonText);
								var entityObject=GetAssociatedFhirResource(listTrackedEntities.trackedEntityInstances[j]);
								if(entityObject!=null)
								{
									if (entityObject.resourceType =="Patient")
									{
										fhirPatientList.push(entityObject);
										continue;
										//console.log(entityObject);
									}
									//console.log(fhirPatientList);
									
									else if (entityObject.resourceType =="Practitioner")
									{
										fhirPractitionerList.push(entityObject);
										continue;
									}
									else if (entityObject.resourceType =="Specimen")
									{
										fhirSpecimenList.push(entityObject);
										continue;
									}
									else if (entityObject.resourceType =="DiagnosticOrder")
									{
										//fhirSpecimenList.push(entityObject);
										fhirDiagnosticOrderList.push(entityObject);
										continue;
									}
									else if (entityObject.resourceType =="Observation")
									{
										//fhirSpecimenList.push(entityObject);
										fhirObservationList.push(entityObject);
										continue;
									}
									else if (entityObject.resourceType =="DiagnosticReport")
									{
										//fhirSpecimenList.push(entityObject);
										fhirDiagnosticReport.push(entityObject);
										continue;
									}
								}
								
							}//for EntityInstances
							//console.log(JSON.stringify(fhirDiagnosticReport));
							//extract Patient
							//console.log("orgunit: "+id);
							//reflist=fhirPatientList;
						}
						//Add All the resource in the table
					var oBundle={};
					oBundle=BuildBundleResponse(fhirOrganizationlist,fhirPatientList,fhirPractitionerList,fhirSpecimenList,fhirDiagnosticOrderList,
					fhirObservationList,fhirDiagnosticReport);
					//console.log(oBundle);
					//document.body.innerHTML = JSON.stringify(oBundle);
					//document.write(JSON.stringify(oBundle));
					//console.log(JSON.stringify(oBundle));
					res.json(oBundle);
					return res.end();
					//document.body. = JSON.stringify(oBundle);
					});//GetTrackedEntityInstances
		});
	  
	}
  records = {
    1: {
      patientId: 1,
      providerId: 1,
      encounterType: "Physical Examination",
      encounterDate: "20131023",
      observations: [
        {
          obsType: "Weight",
          obsValue: "50",
          obsUnit: "kg"
        }, {
          obsType: "Height",
          obsValue: "160",
          obsUnit: "cm"
        }, {
          obsType: "Systolic Blood Pressure",
          obsValue: "120",
          obsUnit: "mmHg"
        }, {
          obsType: "Diastolic Blood Pressure",
          obsValue: "80",
          obsUnit: "mmHg"
        }, {
          obsType: "Heartrate",
          obsValue: "90",
          obsUnit: "bpm"
        }, {
          obsType: "Temperature",
          obsValue: "37",
          obsUnit: "C"
        }
      ]
    },
    2: {
      patientId: 2,
      providerId: 1,
      encounterType: "Physical Examination",
      encounterDate: "20140517",
      observations: [
        {
          obsType: "Weight",
          obsValue: "88",
          obsUnit: "kg"
        }, {
          obsType: "Height",
          obsValue: "180",
          obsUnit: "cm"
        }, {
          obsType: "Systolic Blood Pressure",
          obsValue: "138",
          obsUnit: "mmHg"
        }, {
          obsType: "Diastolic Blood Pressure",
          obsValue: "93",
          obsUnit: "mmHg"
        }, {
          obsType: "Heartrate",
          obsValue: "97",
          obsUnit: "bpm"
        }, {
          obsType: "Temperature",
          obsValue: "37",
          obsUnit: "C"
        }
      ]
    }
  };

  

  app = express();

  //app.use(express.json());

  app.get("/trackedentities", entityinstances);

  server = app.listen(process.env.PORT || 8082, function() {
    return console.log("Service DHIS2 tracked converstion to Fhir is running on port:" + (server.address().port));
  });

}).call(this);