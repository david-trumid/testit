"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const addons_1 = require("@storybook/addons");
const core_events_1 = require("@storybook/core-events");
const react_1 = require("react");
const ADDON_ID = 'interactions';
const PANEL_ID = `${ADDON_ID}/panel`;
const PANEL_TITLE = 'Interactions';
const ACTION_EVENT_ID = `${ADDON_ID}/action-event`;
const WORKFLOW_EVENT_ID = `${ADDON_ID}/workflow-event`;
const DECORATOR_NAME = 'withInteractions';
const PARAM_KEY = 'interactions';
let interactionState;
function setInteractionState(value) {
    interactionState = value;
}
exports.setInteractionState = setInteractionState;
function getInteractionState() {
    return interactionState;
}
exports.getInteractionState = getInteractionState;
const Actions = ({ api, interactions = [] }) => {
    const actions = react_1.useMemo(() => interactions.filter(({ workflow }) => !workflow), [interactions]);
    return !actions.length ? null : (react_1.default.createElement("div", { className: "section" },
        react_1.default.createElement("div", { className: "header" }, "Actions"),
        react_1.default.createElement("div", { key: PANEL_ID }, actions.map(({ name }) => (react_1.default.createElement("button", { className: "actionButton", key: `action-${ADDON_ID}-${name}`, onClick: () => api.emit(`${ACTION_EVENT_ID}-${name}`) }, name))))));
};
const Workflows = ({ api, interactions = [] }) => {
    const workflows = react_1.useMemo(() => interactions.filter(({ workflow }) => workflow), [interactions]);
    return !workflows.length ? null : (react_1.default.createElement("div", { className: "section" },
        react_1.default.createElement("div", { className: "header" }, "Workflow"),
        react_1.default.createElement("div", { className: "workflowItems", key: PANEL_ID }, workflows.map(({ name }, index) => (react_1.default.createElement("div", { className: "workflowStep", key: `workflow-${ADDON_ID}-${name}`, onClick: () => api.emit(`${WORKFLOW_EVENT_ID}-${name}`) },
            "Step ",
            index + 1,
            ": ",
            name))))));
};
const InteractionsPanel = ({ active, api }) => {
    const [interactions, setInteractions] = react_1.useState([]);
    const onStoryChange = react_1.useCallback(id => setInteractions(api.getParameters(id, PARAM_KEY)), []);
    react_1.useEffect(() => {
        api.on(core_events_1.STORY_RENDERED, onStoryChange);
        return () => api.off(core_events_1.STORY_RENDERED, onStoryChange);
    }, []);
    if (!active || !interactions)
        return null;
    return (react_1.default.createElement("div", { className: "interactions" },
        react_1.default.createElement(Actions, { api: api, interactions: interactions }),
        react_1.default.createElement(Workflows, { api: api, interactions: interactions })));
};
exports.withInteractions = addons_1.makeDecorator({
    name: DECORATOR_NAME,
    parameterName: PARAM_KEY,
    skipIfNoParametersOrOptions: true,
    wrapper: (getStory, context, { parameters }) => {
        const channel = addons_1.default.getChannel();
        const story = getStory(context);
        parameters.forEach(({ name, task, workflow }) => {
            const eventId = `${workflow === undefined ? ACTION_EVENT_ID : WORKFLOW_EVENT_ID}-${name}`;
            channel.removeAllListeners(eventId);
            channel.addListener(eventId, () => {
                task(getInteractionState(), story);
            });
        });
        return story;
    },
});
function default_1() {
    addons_1.default.register(ADDON_ID, api => addons_1.default.add(PANEL_ID, {
        type: addons_1.types.PANEL,
        title: PANEL_TITLE,
        render: ({ active }) => react_1.default.createElement(InteractionsPanel, { active: active, api: api, key: ADDON_ID }),
    }));
}
exports.default = default_1;
