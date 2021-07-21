export let fields = [
    {
      name: "title",
      type: "Input",
      value: "",
      placeholder: "Enter title...",
      label: "Event Title",
	  id: "title",
    },
    {
      name: "description",
      type: "TextArea",
      value: "",
      placeholder: "Enter description...",
      label: "Event description",
	  id: "description",
    },
	{
		name: 'coursetype_id',
		type: 'Select',
		value: 1,
		label: 'Event Type',
		id: 'coursetype-id',
		options: [
			{label: 'In Person', value: 1},
			{label: 'Online', value: 2},
			{label: 'Pre-recorded', value: 3}
		]
	},
	{
		name: 'course_size',
		id: 'course-size',
		type: 'Number',
		value: '',
		placeholder: 0,
		label: 'Attendance limit',
	},
	{
		name: 'starts',
		id: 'starts',
		type: 'DateTime',
		value: '',
		label: 'Start',
		datetime: new Date().toISOString(),
		shift: false,
	},
	{
		name: 'ends',
		id: 'ends',
		type: 'DateTime',
		value: '',
		label: 'End',
		datetime: new Date().toISOString(),
		shift: false,
	},
];
